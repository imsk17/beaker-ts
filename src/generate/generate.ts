import {
  AppSpec,
  DeclaredSchemaValueSpec,
  DynamicSchemaValueSpec,
  HintSpec,
  Schema,
  SchemaSpec,
  AppSources,
} from "./appspec";

import algosdk, { ABIMethod } from "algosdk";
import ts, { factory } from "typescript";
import { writeFileSync } from "fs";

// AMAZING resource:
// https://ts-ast-viewer.com/#

const CLIENT_NAME = "ApplicationClient";
const CLIENT_IMPORTS = `{${CLIENT_NAME}}` 
const CLIENT_PATH = "./application_client/";

const APP_SPEC_IMPORTS = "{Schema,AVMType}";
const APP_SPEC_PATH = "./generate/";

const ALGOSDK_IMPORTS = "algosdk";
const ALGOSDK_PATH = "algosdk";

const NUMBER_TYPES: string[] = [
  "uint8",
  "uint16",
  "uint32",
  "uint64",
  "uint128",
  "uint256",
  "asset",
  "app",
];

const STRING_TYPES: string[] = ["account", "address", "string"];

const TXN_TYPES: string[] = [
  "txn",
  "pay",
  "axfer",
  "acfg",
  "appl",
  "keyreg",
  "frz",
];

export default function generateApplicationClient(appSpec: AppSpec, path: string) {
  const name = appSpec.contract.name;

  const nodes: ts.Node[] = generateImports();

  const classNode = generateClass(appSpec);
  nodes.push(classNode);

  const outputFile = ts
    .createPrinter()
    .printList(
      ts.ListFormat.MultiLine,
      factory.createNodeArray(nodes),
      ts.createSourceFile(
        name,
        "",
        ts.ScriptTarget.ESNext,
        true,
        ts.ScriptKind.TS
      )
    );

  const file_name = `${name.toLowerCase()}_client.ts`;
  writeFileSync(path + file_name, outputFile);
}

// create the imports for the generated client
function generateImports(): ts.ImportDeclaration[] {
  return [
    // Import algosdk
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(ALGOSDK_IMPORTS),
        undefined
      ),
      factory.createStringLiteral(ALGOSDK_PATH),
      undefined
    ),

    // Import generic client
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(CLIENT_IMPORTS),
        undefined
      ),
      factory.createStringLiteral(CLIENT_PATH),
      undefined
    ),

    // Import app spec stuff
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        factory.createIdentifier(APP_SPEC_IMPORTS),
        undefined
      ),
      factory.createStringLiteral(APP_SPEC_PATH),
      undefined
    ),
  ];
}

function generateClass(appSpec: AppSpec): ts.ClassDeclaration {
  return factory.createClassDeclaration(
    undefined,
    [
      factory.createModifier(ts.SyntaxKind.ExportKeyword),
      factory.createModifier(ts.SyntaxKind.DefaultKeyword),
    ],
    factory.createIdentifier(appSpec.contract.name),
    undefined,
    [
      factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        factory.createExpressionWithTypeArguments(
          factory.createIdentifier(CLIENT_NAME),
          undefined
        ),
      ]),
    ],
    [
      ...generateContractProperties(appSpec),
      ...appSpec.contract.methods.map((meth) => generateMethodImpl(meth)),
    ]
  );
}

function tsTypeFromAbiType(argType: string): ts.TypeNode {
  if (NUMBER_TYPES.includes(argType))
    return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);

  if (STRING_TYPES.includes(argType))
    return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

  if (TXN_TYPES.includes(argType)) {
    const acceptableTxns: ts.TypeNode[] = [
      factory.createTypeReferenceNode("algosdk.TransactionWithSigner"),
      factory.createTypeReferenceNode("algosdk.Transaction"),
    ];
    return factory.createUnionTypeNode(acceptableTxns);
  }

  return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}

function generateMethodImpl(method: ABIMethod): ts.ClassElement {
  const params: ts.ParameterDeclaration[] = [];

  const callArgs: ts.Expression[] = [];

  const abiMethodArgs: ts.PropertyAssignment[] = [];

  callArgs.push(
    factory.createCallExpression(
      factory.createIdentifier("algosdk.getMethodByName"),
      undefined,
      [
        factory.createPropertyAccessExpression(
          factory.createThis(),
          factory.createIdentifier("methods")
        ),
        factory.createStringLiteral(method.name),
      ]
    )
  );

  for (const arg of method.args) {
    abiMethodArgs.push(
      factory.createPropertyAssignment(
        factory.createIdentifier(arg.name),
        factory.createIdentifier(arg.name)
      )
    );

    const typeParams = factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      arg.name,
      undefined,
      tsTypeFromAbiType(arg.type.toString()),
      undefined
    );

    params.push(typeParams);
  }

  const body = factory.createBlock(
    [
      factory.createReturnStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createThis(),
            factory.createIdentifier("call")
          ),
          undefined,
          [...callArgs, factory.createObjectLiteralExpression(abiMethodArgs)]
        )
      ),
    ],
    true
  );

  const methodSpec = factory.createMethodDeclaration(
    undefined,
    undefined,
    undefined,
    method.name,
    undefined,
    undefined,
    params,
    undefined,
    body
  );

  return methodSpec;
}

function copySchemaObject(so: Schema): ts.Expression {
  const declaredAppSchemaProps = Object.entries(so.declared).map(
    (sv: [string, DeclaredSchemaValueSpec]): ts.PropertyAssignment => {
      return factory.createPropertyAssignment(
        factory.createIdentifier(sv[0]),
        factory.createObjectLiteralExpression([
          factory.createPropertyAssignment(
            factory.createIdentifier("type"),
            factory.createIdentifier(`Type.${sv[1].type}`)
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier("key"),
            factory.createStringLiteral(sv[1].key ? sv[1].key : "")
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier("desc"),
            factory.createStringLiteral(sv[1].desc ? sv[1].desc : "")
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier("static"),
            sv[1].static ? factory.createTrue() : factory.createFalse()
          ),
        ])
      );
    }
  );

  const dynamicAppSchemaProps = Object.entries(so.dynamic).map(
    (sv: [string, DynamicSchemaValueSpec]): ts.PropertyAssignment => {
      return factory.createPropertyAssignment(
        factory.createIdentifier(sv[0]),
        factory.createObjectLiteralExpression([
          factory.createPropertyAssignment(
            factory.createIdentifier("type"),
            factory.createIdentifier(sv[1].type.toString())
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier("desc"),
            factory.createStringLiteral(sv[1].desc ? sv[1].desc : "")
          ),
          factory.createPropertyAssignment(
            factory.createIdentifier("maxKeys"),
            factory.createNumericLiteral(sv[1].maxKeys)
          ),
        ])
      );
    }
  );

  return factory.createObjectLiteralExpression([
    factory.createPropertyAssignment(
      factory.createIdentifier("declared"),
      factory.createObjectLiteralExpression(declaredAppSchemaProps)
    ),
    factory.createPropertyAssignment(
      factory.createIdentifier("dynamic"),
      factory.createObjectLiteralExpression(dynamicAppSchemaProps)
    ),
  ]);
}

function generateContractProperties(spec: AppSpec): ts.PropertyDeclaration[] {
  const descr = spec.contract.description;
  const methods = spec.contract.methods;
  const source = spec.source;
  const schema = spec.schema;

  // create desc property
  const descrProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("desc"),
    undefined,
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createStringLiteral(descr ? descr : "")
  );

  // Create approval program property
  const approvalProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("approvalProgram"),
    undefined,
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createStringLiteral(source.approval)
  );

  // Create clear program property
  const clearProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("clearProgram"),
    undefined,
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createStringLiteral(source.clear)
  );

  // Create App Schema Property
  const appSchemaProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("appSchema"),
    undefined,
    factory.createTypeReferenceNode("Schema"),
    copySchemaObject(schema.global)
  );

  // Create Acct schema property
  const acctSchemaProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("acctSchema"),
    undefined,
    factory.createTypeReferenceNode("Schema"),
    copySchemaObject(schema.local)
  );

  // Add methods
  const methodAssignments: ts.Expression[] = [];
  for (const meth of methods) {
    const argObjs: ts.ObjectLiteralExpression[] = meth.args.map((arg) => {
      return factory.createObjectLiteralExpression([
        factory.createPropertyAssignment(
          factory.createIdentifier("type"),
          factory.createStringLiteral(arg.type.toString())
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("name"),
          factory.createStringLiteral(arg.name ? arg.name : "")
        ),
        factory.createPropertyAssignment(
          factory.createIdentifier("desc"),
          factory.createStringLiteral(arg.description ? arg.description : "")
        ),
      ]);
    });

    const returnObj = factory.createObjectLiteralExpression([
      factory.createPropertyAssignment(
        factory.createIdentifier("type"),
        factory.createStringLiteral(meth.returns.type.toString())
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier("desc"),
        factory.createStringLiteral(
          meth.returns.description ? meth.returns.description : ""
        )
      ),
    ]);

    methodAssignments.push(
      factory.createNewExpression(
        factory.createIdentifier("algosdk.ABIMethod"),
        undefined,
        [
          factory.createObjectLiteralExpression([
            factory.createPropertyAssignment(
              factory.createIdentifier("name"),
              factory.createStringLiteral(meth.name)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier("desc"),
              factory.createStringLiteral(
                meth.description ? meth.description : ""
              )
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier("args"),
              factory.createArrayLiteralExpression(argObjs)
            ),
            factory.createPropertyAssignment(
              factory.createIdentifier("returns"),
              returnObj
            ),
          ]),
        ]
      )
    );
  }

  // create methods property
  const methodProps = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("methods"),
    undefined,
    factory.createArrayTypeNode(
      factory.createTypeReferenceNode(
        factory.createIdentifier("algosdk.ABIMethod")
      )
    ),
    factory.createArrayLiteralExpression(methodAssignments, true)
  );

  return [
    descrProp,
    appSchemaProp,
    acctSchemaProp,
    approvalProp,
    clearProp,
    methodProps,
  ];
}
