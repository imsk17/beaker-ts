import {
  AppSpec,
  DeclaredSchemaValueSpec,
  DynamicSchemaValueSpec,
  HintSpec,
  SchemaSpec,
  AppSchemaSpec,
} from "./appspec";

import { ABIContract, ABIMethod } from "algosdk";
import ts, { factory } from "typescript";
import { writeFileSync } from "fs";

// AMAZING resource:
// https://ts-ast-viewer.com/#

const CLIENT_NAME = "GenericApplicationClient";
const CLIENT_PATH = "./src/generic_client";

const ALGOSDK_IMPORTS = "algosdk, {TransactionWithSigner, ABIMethod, ABIMethodParams, getMethodByName}"
const ALGOSDK_PATH = "algosdk"


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
        false, factory.createIdentifier(ALGOSDK_IMPORTS), undefined
      ),
      factory.createStringLiteral(ALGOSDK_PATH),
      undefined
    ),

    // Import generic client
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false, factory.createIdentifier(CLIENT_NAME), undefined
      ),
      factory.createStringLiteral(CLIENT_PATH),
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
    return factory.createTypeReferenceNode("TransactionWithSigner")

  return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}

export function generateMethod(method: ABIMethod): ts.ClassElement {
  const params: ts.ParameterDeclaration[] = [];

  const callArgs: ts.Expression[] = [];

  const abiMethodArgs: ts.PropertyAssignment[] = [];

  callArgs.push(factory.createCallExpression(
    factory.createIdentifier("getMethodByName"),
    undefined,
    [
        factory.createPropertyAccessExpression(
            factory.createThis(),
            factory.createIdentifier("methods")
        ),
        factory.createStringLiteral(method.name)
    ],
  ))


  for (const arg of method.args) {
    abiMethodArgs.push( 
        factory.createPropertyAssignment(
            factory.createIdentifier(arg.name), factory.createIdentifier(arg.name)
        )
    )

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

  const props = generateContractProperties(
    contract.description,
    contract.methods
  );

  return factory.createClassDeclaration(
    undefined,
    undefined,
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

function generateContractProperties(
  descr: string,
  methods: ABIMethod[]
): ts.PropertyDeclaration[] {

  // create desc property
  const descrProp = factory.createPropertyDeclaration(
    undefined,
    undefined,
    factory.createIdentifier("desc"),
    undefined,
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
    factory.createStringLiteral(descr ? descr : "")
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
          factory.createStringLiteral(meth.returns.description?meth.returns.description:"")
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

  return [descrProp, methodProps];
}
