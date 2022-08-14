import {
  AppSpec,
  DeclaredSchemaValueSpec,
  DynamicSchemaValueSpec,
  HintSpec,
  Schema,
  SchemaSpec,
  AppSources,
} from "./appspec";

import { ABIContract, ABIMethod } from "algosdk";
import ts, { factory } from "typescript";
import { writeFileSync } from "fs";

// AMAZING resource:
// https://ts-ast-viewer.com/#

const CLIENT_NAME = "GenericApplicationClient";
const CLIENT_PATH = "./generic_client";

const APP_SPEC_IMPORTS = "{Schema}";
const APP_SPEC_PATH = "./generate/appspec";

const ALGOSDK_IMPORTS =
  "algosdk, {TransactionWithSigner, ABIMethod, ABIMethodParams, getMethodByName}";
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

export function generateClient(appSpec: AppSpec, path: string) {
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
export function generateImports(): ts.ImportDeclaration[] {
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
        factory.createIdentifier(CLIENT_NAME),
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

function tsTypeFromAbiType(argType: string): ts.TypeNode {
  if (NUMBER_TYPES.includes(argType))
    return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);

  if (STRING_TYPES.includes(argType))
    return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

  if (TXN_TYPES.includes(argType))
    //  // TODO: create a specific type for each txn type?
    return factory.createTypeReferenceNode("TransactionWithSigner");

  return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}

export function generateMethod(method: ABIMethod): ts.ClassElement {
  const params: ts.ParameterDeclaration[] = [];

  const callArgs: ts.Expression[] = [];

  const abiMethodArgs: ts.PropertyAssignment[] = [];

  callArgs.push(
    factory.createCallExpression(
      factory.createIdentifier("getMethodByName"),
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

export function generateClass(appSpec: AppSpec): ts.ClassDeclaration {
  const contract = appSpec.contract;
  const methods = contract.methods.map((meth) => generateMethod(meth));

  const props = generateContractProperties(appSpec);

  return factory.createClassDeclaration(
    undefined,
    [
      factory.createModifier(ts.SyntaxKind.ExportKeyword),
      factory.createModifier(ts.SyntaxKind.DefaultKeyword),
    ],
    factory.createIdentifier(contract.name),
    undefined,
    [
      factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        factory.createExpressionWithTypeArguments(
          factory.createIdentifier(CLIENT_NAME),
          undefined
        ),
      ]),
    ],
    [...props, ...methods]
  );
}

function copySchemaObject(so: Schema): ts.Expression {
  const declaredAppSchemaProps = Object.entries(so.declared).map(
    (sv: [string, DeclaredSchemaValueSpec]): ts.PropertyAssignment => {
      return factory.createPropertyAssignment(
        factory.createIdentifier(sv[0]),
        factory.createObjectLiteralExpression([
          factory.createPropertyAssignment(
            factory.createIdentifier("type"),
            factory.createStringLiteral(sv[1].type)
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
            factory.createStringLiteral(sv[1].type)
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

  return factory.createObjectLiteralExpression(
    [
      factory.createPropertyAssignment(
        factory.createIdentifier("declared"),
        factory.createObjectLiteralExpression(declaredAppSchemaProps, true)
      ),
      factory.createPropertyAssignment(
        factory.createIdentifier("dynamic"),
        factory.createObjectLiteralExpression(dynamicAppSchemaProps, true)
      ),
    ],
    true
  );
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

  // Create Schema Property
  const appSchemaProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("appSchema"),
    undefined,
    factory.createTypeReferenceNode("Schema"),
    copySchemaObject(schema.global)
  );

  const acctSchemaProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("acctSchema"),
    undefined,
    factory.createTypeReferenceNode("Schema"),
    copySchemaObject(schema.local)
  );

  const methodAssignments: ts.Expression[] = [];

  for (const meth of methods) {
    const argObjs: ts.ObjectLiteralExpression[] = [];

    for (const arg of meth.args) {
      argObjs.push(
        factory.createObjectLiteralExpression(
          [
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
              factory.createStringLiteral(
                arg.description ? arg.description : ""
              )
            ),
          ],
          false
        )
      );
    }

    const returnObj = factory.createObjectLiteralExpression(
      [
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
      ],
      false
    );

    methodAssignments.push(
      factory.createNewExpression(
        factory.createIdentifier("ABIMethod"),
        undefined,
        [
          factory.createObjectLiteralExpression(
            [
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
                factory.createArrayLiteralExpression(argObjs, true)
              ),
              factory.createPropertyAssignment(
                factory.createIdentifier("returns"),
                returnObj
              ),
            ],
            true
          ),
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
      factory.createTypeReferenceNode(factory.createIdentifier("ABIMethod"))
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
