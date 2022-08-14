import {
  AppSpec,
  DeclaredSchemaValueSpec,
  DynamicSchemaValueSpec,
  HintSpec,
  SchemaSpec,
  AppSchemaSpec,
} from "./appspec";

import { ABIMethod } from "algosdk";
import ts, { factory } from "typescript";
import { writeFileSync } from "fs";

const CLIENT_NAME = "GenericApplicationClient";
const CLIENT_PATH = "./src/generic_client";

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

// create the imports for the generated client
export function generateImports(): ts.ImportDeclaration[] {
  return [
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
  ];
}

function generateStruct(): ts.NodeArray<ts.Node> {
  // create name property
  const nameProp = factory.createPropertySignature(
    undefined,
    factory.createIdentifier("name"),
    undefined,
    factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
  );

  // create age property
  const ageProp = factory.createPropertySignature(
    undefined,
    factory.createIdentifier("age"),
    undefined,
    factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  );

  // create User type
  const userType = factory.createTypeAliasDeclaration(
    undefined,
    [factory.createModifier(ts.SyntaxKind.ExportKeyword)],
    factory.createIdentifier("User"),
    undefined,
    factory.createTypeLiteralNode([nameProp, ageProp])
  );

  const nodes = factory.createNodeArray([userType]);
  return nodes;
}

export function generateMethod(method: ABIMethod): ts.ClassElement {
  const params: ts.ParameterDeclaration[] = [];
  const identifiers: ts.Expression[] = [];

  for (const arg of method.args) {
    let constraint;
    if (NUMBER_TYPES.includes(arg.type.toString())) {
      constraint = factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
    } else if (STRING_TYPES.includes(arg.type.toString())) {
      constraint = factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    } else if (TXN_TYPES.includes(arg.type.toString())) {
      // TODO: create a type for these
      constraint = factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
    }

    identifiers.push(factory.createIdentifier(arg.name));

    const typeParams = factory.createParameterDeclaration(
      undefined,
      undefined,
      undefined,
      arg.name,
      undefined,
      constraint
    );
    params.push(typeParams);
  }


  const body = factory.createBlock(
    [
      factory.createReturnStatement(
        factory.createCallExpression(
          factory.createPropertyAccessExpression(
            factory.createThis(), factory.createIdentifier("call")
          ),
          undefined,
          identifiers
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

export function generateClass(
  name: string,
  methods: ts.ClassElement[]
): ts.ClassDeclaration {
  return factory.createClassDeclaration(
    undefined,
    undefined,
    factory.createIdentifier(name),
    undefined,
    [
      factory.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [
        factory.createExpressionWithTypeArguments(
          factory.createIdentifier(CLIENT_NAME),
          undefined
        ),
      ]),
    ],
    methods
  );
}


export function generateClient(appSpec: AppSpec, path: string) {
  console.log(appSpec);
  const name = appSpec.contract.name;

  const nodes: ts.Node[] = generateImports();

  const classNode = generateClass(name, appSpec.contract.methods.map(meth => generateMethod(meth)));

  nodes.push(classNode)

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
