import { AppSpec } from "./appspec";

import ts, { factory } from "typescript";
import { writeFileSync } from "fs";

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

export function generateClient(appSpec: AppSpec, path: string) {
  console.log(appSpec);

  const name = `${appSpec.contract.name}_client.ts`;
  const sourceFile = ts.createSourceFile(
    name,
    "",
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter();

  const nodes = generateStruct();
  const outputFile = printer.printList(
    ts.ListFormat.MultiLine,
    nodes,
    sourceFile
  );

  //... other code from above

  writeFileSync(path + name, outputFile);
}
