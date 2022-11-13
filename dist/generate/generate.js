"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApplicationClient = void 0;
const algosdk_1 = __importDefault(require("algosdk"));
const typescript_1 = __importDefault(require("typescript"));
const { factory } = typescript_1.default;
// AMAZING resource:
// https://ts-ast-viewer.com/#
const CLIENT_NAME = 'bkr.ApplicationClient';
// TODO: only import if we _need_ them
const CLIENT_IMPORTS = `* as bkr`;
const CLIENT_PATH = 'beaker-ts';
const ALGOSDK_IMPORTS = 'algosdk';
const ALGOSDK_PATH = 'algosdk';
const REF_TYPES = ['account', 'application', 'asset'];
const TXN_TYPES = [
    'txn',
    'pay',
    'axfer',
    'acfg',
    'appl',
    'keyreg',
    'frz',
];
// native types
const UINT8_ARRAY_IDENT = factory.createIdentifier('Uint8Array');
const UINT8_ARRAY_TYPE = factory.createTypeReferenceNode(UINT8_ARRAY_IDENT);
// sdk types
const ABI_METHOD_IDENT = factory.createIdentifier('algosdk.ABIMethod');
const ABI_METHOD_TYPE = factory.createTypeReferenceNode(ABI_METHOD_IDENT);
const ATC_IDENT = factory.createIdentifier('algosdk.AtomicTransactionComposer');
const ATC_TYPE = factory.createTypeReferenceNode(ATC_IDENT);
// bkr types
const ABI_RESULT_IDENT = factory.createIdentifier('bkr.ABIResult');
const DECODE_NAMED_TUPLE_IDENT = factory.createIdentifier('bkr.decodeNamedTuple');
const SCHEMA_TYPE = factory.createTypeReferenceNode('bkr.Schema');
const TRANSACTION_OVERRIDES_TYPE = factory.createTypeReferenceNode('bkr.TransactionOverrides');
function tsTypeFromAbiType(argType) {
    if (typeof argType === 'string') {
        if (TXN_TYPES.includes(argType))
            return factory.createUnionTypeNode([
                factory.createTypeReferenceNode('algosdk.TransactionWithSigner'),
                factory.createTypeReferenceNode('algosdk.Transaction'),
            ]);
        if (REF_TYPES.includes(argType)) {
            if (['application', 'asset'].includes(argType))
                return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.BigIntKeyword);
            return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword);
        }
    }
    const abiType = typeof argType === 'string' ? algosdk_1.default.ABIType.from(argType) : argType;
    switch (abiType.constructor) {
        case algosdk_1.default.ABIByteType:
            return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.NumberKeyword);
        case algosdk_1.default.ABIUintType:
        case algosdk_1.default.ABIUfixedType:
            return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.BigIntKeyword);
        case algosdk_1.default.ABIAddressType:
        case algosdk_1.default.ABIStringType:
            return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword);
        case algosdk_1.default.ABIBoolType:
            return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.BooleanKeyword);
        case algosdk_1.default.ABIArrayStaticType:
            const asStaticArr = abiType;
            switch (asStaticArr.childType.constructor) {
                // If its bytes, make it a uint8array
                case algosdk_1.default.ABIByteType:
                    return UINT8_ARRAY_TYPE;
            }
            return factory.createArrayTypeNode(tsTypeFromAbiType(asStaticArr.childType));
        case algosdk_1.default.ABIArrayDynamicType:
            const asArr = abiType;
            switch (asArr.childType.constructor) {
                // If its bytes, make it a uint8array
                case algosdk_1.default.ABIByteType:
                    return UINT8_ARRAY_TYPE;
            }
            return factory.createArrayTypeNode(tsTypeFromAbiType(asArr.childType));
        case algosdk_1.default.ABITupleType:
            const asTuple = abiType;
            return factory.createTupleTypeNode(asTuple.childTypes.map((elem) => {
                return tsTypeFromAbiType(elem);
            }));
    }
    return factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.AnyKeyword);
}
function defaultValueFromTsType(t) {
    switch (t.kind) {
        case typescript_1.default.SyntaxKind.StringKeyword:
            return factory.createStringLiteral('');
        case typescript_1.default.SyntaxKind.NumberKeyword:
            return factory.createNumericLiteral(0);
        case typescript_1.default.SyntaxKind.BigIntKeyword:
            return factory.createCallExpression(factory.createIdentifier('BigInt'), undefined, [factory.createNumericLiteral('0')]);
        case typescript_1.default.SyntaxKind.BooleanKeyword:
            return factory.createIdentifier('false');
        case typescript_1.default.SyntaxKind.TypeReference:
            return factory.createNewExpression(UINT8_ARRAY_IDENT, undefined, []);
    }
    return factory.createIdentifier('undefined');
}
function generateApplicationClient(appSpec, beakerPath) {
    const name = appSpec.contract.name;
    const nodes = generateImports(beakerPath);
    const structNodes = generateStructTypes(appSpec);
    nodes.push(...structNodes);
    const classNode = generateClass(appSpec);
    nodes.push(classNode);
    return typescript_1.default
        .createPrinter()
        .printList(typescript_1.default.ListFormat.MultiLine, factory.createNodeArray(nodes), typescript_1.default.createSourceFile(name, '', typescript_1.default.ScriptTarget.ESNext, true, typescript_1.default.ScriptKind.TS));
}
exports.generateApplicationClient = generateApplicationClient;
// create the imports for the generated client
function generateImports(beakerPath) {
    return [
        // Import algosdk
        factory.createImportDeclaration(undefined, undefined, factory.createImportClause(false, factory.createIdentifier(ALGOSDK_IMPORTS), undefined), factory.createStringLiteral(ALGOSDK_PATH), undefined),
        // Import generic client
        factory.createImportDeclaration(undefined, undefined, factory.createImportClause(false, factory.createIdentifier(CLIENT_IMPORTS), undefined), factory.createStringLiteral(beakerPath ? beakerPath : CLIENT_PATH), undefined),
    ];
}
function generateClass(appSpec) {
    return factory.createClassDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], factory.createIdentifier(appSpec.contract.name), undefined, [
        factory.createHeritageClause(typescript_1.default.SyntaxKind.ExtendsKeyword, [
            factory.createExpressionWithTypeArguments(factory.createIdentifier(CLIENT_NAME), undefined),
        ]),
    ], [
        ...generateContractProperties(appSpec),
        ...appSpec.contract.methods.map((meth) => generateMethodImpl(meth, appSpec)),
        generateComposeMethods(appSpec),
    ]);
}
function generateComposeMethods(spec) {
    // create desc property
    return factory.createPropertyDeclaration(undefined, undefined, factory.createIdentifier('compose'), undefined, undefined, factory.createObjectLiteralExpression(spec.contract.methods.map((meth) => {
        const [key, value] = generateComposeMethodImpl(meth, spec);
        return factory.createPropertyAssignment(key, value);
    }), true));
}
// Creates the methods on the AppClient class used to call specific ABI methods
function generateMethodImpl(method, spec) {
    const params = [];
    const abiMethodArgs = [];
    const argParams = [];
    const hint = method.name in spec.hints ? spec.hints[method.name] : {};
    for (const arg of method.args) {
        if (arg.name === undefined)
            continue;
        const argName = factory.createIdentifier(arg.name);
        let argType = tsTypeFromAbiType(arg.type.toString());
        if (hint !== undefined &&
            hint.structs !== undefined &&
            arg.name in hint.structs) {
            const structHint = hint.structs[arg.name];
            if (structHint !== undefined)
                argType = factory.createTypeReferenceNode(structHint.name);
        }
        const defaultArg = (hint === null || hint === void 0 ? void 0 : hint.default_arguments) !== undefined &&
            arg.name in hint.default_arguments
            ? hint.default_arguments[arg.name]
            : undefined;
        let argVal = factory.createIdentifier(`args.${arg.name}`);
        if (defaultArg !== undefined) {
            let data;
            if (typeof defaultArg.data == 'string') {
                data = factory.createStringLiteral(defaultArg.data);
            }
            else if (typeof defaultArg.data == 'bigint') {
                data = factory.createBigIntLiteral(defaultArg.data.toString());
            }
            else if (typeof defaultArg.data == 'number') {
                data = factory.createNumericLiteral(defaultArg.data);
            }
            else {
                data = factory.createIdentifier('undefined');
            }
            argVal = factory.createConditionalExpression(factory.createBinaryExpression(argVal, factory.createToken(typescript_1.default.SyntaxKind.EqualsEqualsEqualsToken), factory.createIdentifier('undefined')), factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), factory.createAsExpression(factory.createAwaitExpression(factory.createCallExpression(factory.createIdentifier('this.resolve'), undefined, [factory.createStringLiteral(defaultArg.source), data])), argType), factory.createToken(typescript_1.default.SyntaxKind.ColonToken), argVal);
        }
        abiMethodArgs.push(factory.createPropertyAssignment(argName, argVal));
        const optional = defaultArg !== undefined
            ? factory.createToken(typescript_1.default.SyntaxKind.QuestionToken)
            : undefined;
        //factory.createPropertyDeclaration
        argParams.push(factory.createPropertySignature(undefined, arg.name, optional, argType));
    }
    // Expect args
    if (argParams.length > 0) {
        params.push(factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('args'), undefined, factory.createTypeLiteralNode(argParams)));
    }
    // Any tx overrides
    const txnParams = factory.createIdentifier('txnParams');
    params.push(factory.createParameterDeclaration(undefined, undefined, undefined, txnParams, factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), TRANSACTION_OVERRIDES_TYPE));
    // Set up return type
    let abiRetType = factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.VoidKeyword);
    const resultArgs = [factory.createIdentifier('result')];
    if (method.returns.type.toString() !== 'void') {
        abiRetType = tsTypeFromAbiType(method.returns.type.toString());
        // Always `output` here because pyteal,
        // when others app specs come in we should consider them
        if (hint !== undefined &&
            (hint === null || hint === void 0 ? void 0 : hint.structs) !== undefined &&
            'output' in hint.structs) {
            const outputHint = hint.structs['output'];
            if (outputHint !== undefined) {
                abiRetType = factory.createTypeReferenceNode(outputHint === null || outputHint === void 0 ? void 0 : outputHint.name);
                resultArgs.push(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createIdentifier(outputHint.name), factory.createIdentifier('decodeResult')), undefined, [
                    factory.createPropertyAccessExpression(factory.createIdentifier('result'), factory.createIdentifier('returnValue')),
                ]));
            }
        }
        else {
            resultArgs.push(factory.createAsExpression(factory.createPropertyAccessExpression(factory.createIdentifier('result'), factory.createIdentifier('returnValue')), abiRetType));
        }
    }
    const composeArgs = [];
    if (argParams.length > 0) {
        composeArgs.push(factory.createObjectLiteralExpression(abiMethodArgs));
    }
    composeArgs.push(txnParams);
    const composeExpr = factory.createAwaitExpression(factory.createCallExpression(factory.createIdentifier('this.compose.' + method.name), undefined, composeArgs));
    const body = factory.createBlock([
        factory.createVariableStatement(undefined, factory.createVariableDeclarationList([
            factory.createVariableDeclaration(factory.createIdentifier('result'), undefined, undefined, factory.createAwaitExpression(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createThis(), factory.createIdentifier('execute')), undefined, [composeExpr]))),
        ], typescript_1.default.NodeFlags.Const)),
        factory.createReturnStatement(factory.createNewExpression(ABI_RESULT_IDENT, [abiRetType], resultArgs)),
    ], true);
    const retType = factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [factory.createTypeReferenceNode(ABI_RESULT_IDENT, [abiRetType])]);
    const methodSpec = factory.createMethodDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)], undefined, method.name, undefined, undefined, params, retType, body);
    return methodSpec;
}
// Creates the methods on the AppClient class used to call specific ABI methods to produce
// the transactions, which are nested inside a `transactions` property.
function generateComposeMethodImpl(method, spec) {
    const params = [];
    const callArgs = [];
    const abiMethodArgs = [];
    const argParams = [];
    const hint = method.name in spec.hints ? spec.hints[method.name] : {};
    callArgs.push(factory.createCallExpression(factory.createIdentifier('algosdk.getMethodByName'), undefined, [
        factory.createPropertyAccessExpression(factory.createThis(), factory.createIdentifier('methods')),
        factory.createStringLiteral(method.name),
    ]));
    for (const arg of method.args) {
        if (arg.name === undefined) {
            continue;
        }
        const argName = factory.createIdentifier(arg.name);
        let argType = tsTypeFromAbiType(arg.type.toString());
        if (hint !== undefined &&
            hint.structs !== undefined &&
            arg.name in hint.structs) {
            const structHint = hint.structs[arg.name];
            if (structHint !== undefined)
                argType = factory.createTypeReferenceNode(structHint.name);
        }
        const defaultArg = (hint === null || hint === void 0 ? void 0 : hint.default_arguments) !== undefined &&
            arg.name in hint.default_arguments
            ? hint.default_arguments[arg.name]
            : undefined;
        let argVal = factory.createIdentifier(`args.${arg.name}`);
        if (defaultArg !== undefined) {
            let data;
            if (typeof defaultArg.data == 'string') {
                data = factory.createStringLiteral(defaultArg.data);
            }
            else if (typeof defaultArg.data == 'bigint') {
                data = factory.createBigIntLiteral(defaultArg.data.toString());
            }
            else if (typeof defaultArg.data == 'number') {
                data = factory.createNumericLiteral(defaultArg.data);
            }
            else {
                data = factory.createIdentifier('undefined');
            }
            argVal = factory.createConditionalExpression(factory.createBinaryExpression(argVal, factory.createToken(typescript_1.default.SyntaxKind.EqualsEqualsEqualsToken), factory.createIdentifier('undefined')), factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), factory.createAwaitExpression(factory.createCallExpression(factory.createIdentifier('this.resolve'), undefined, [factory.createStringLiteral(defaultArg.source), data])), factory.createToken(typescript_1.default.SyntaxKind.ColonToken), argVal);
        }
        abiMethodArgs.push(factory.createPropertyAssignment(argName, argVal));
        const optional = defaultArg !== undefined
            ? factory.createToken(typescript_1.default.SyntaxKind.QuestionToken)
            : undefined;
        argParams.push(factory.createPropertySignature(undefined, arg.name, optional, argType));
    }
    // Expect args
    if (argParams.length > 0) {
        params.push(factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('args'), undefined, factory.createTypeLiteralNode(argParams)));
    }
    const txnParams = factory.createIdentifier('txnParams');
    params.push(factory.createParameterDeclaration(undefined, undefined, undefined, txnParams, factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), TRANSACTION_OVERRIDES_TYPE));
    const atcParam = factory.createIdentifier('atc');
    params.push(factory.createParameterDeclaration(undefined, undefined, undefined, atcParam, factory.createToken(typescript_1.default.SyntaxKind.QuestionToken), ATC_TYPE));
    const body = factory.createBlock([
        factory.createReturnStatement(factory.createCallExpression(factory.createPropertyAccessExpression(factory.createThis(), factory.createIdentifier('addMethodCall')), undefined, [
            ...callArgs,
            factory.createObjectLiteralExpression(abiMethodArgs),
            txnParams,
            atcParam,
        ])),
    ], true);
    const retType = factory.createTypeReferenceNode(factory.createIdentifier('Promise'), [factory.createTypeReferenceNode(ATC_IDENT)]);
    const fncSpec = factory.createArrowFunction([factory.createModifier(typescript_1.default.SyntaxKind.AsyncKeyword)], undefined, params, retType, undefined, body);
    return [method.name, fncSpec];
}
function copySchemaObject(so) {
    const declaredAppSchemaProps = Object.entries(so.declared).map((sv) => {
        return factory.createPropertyAssignment(factory.createIdentifier(sv[0]), factory.createObjectLiteralExpression([
            factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createIdentifier(`bkr.AVMType.${sv[1].type}`)),
            objStrProperty('key', sv[1].key),
            objStrProperty('desc', sv[1].desc),
            factory.createPropertyAssignment(factory.createIdentifier('static'), sv[1].static ? factory.createTrue() : factory.createFalse()),
        ]));
    });
    const reservedAppSchemaProps = Object.entries(so.reserved).map((sv) => {
        return factory.createPropertyAssignment(factory.createIdentifier(sv[0]), factory.createObjectLiteralExpression([
            factory.createPropertyAssignment(factory.createIdentifier('type'), factory.createIdentifier(`bkr.AVMType.${sv[1].type.toString()}`)),
            objStrProperty('desc', sv[1].desc),
            factory.createPropertyAssignment(factory.createIdentifier('max_keys'), factory.createNumericLiteral(sv[1].max_keys ? sv[1].max_keys : 0)),
        ]));
    });
    return factory.createObjectLiteralExpression([
        factory.createPropertyAssignment(factory.createIdentifier('declared'), factory.createObjectLiteralExpression(declaredAppSchemaProps)),
        factory.createPropertyAssignment(factory.createIdentifier('reserved'), factory.createObjectLiteralExpression(reservedAppSchemaProps)),
    ]);
}
function generateStructTypes(spec) {
    const hints = spec.hints;
    const structs = {};
    for (const k of Object.keys(hints)) {
        const hint = hints[k];
        if (hint !== undefined && hint.structs !== undefined) {
            for (const sk of Object.keys(hint.structs)) {
                const struct = hint.structs[sk];
                if (struct !== undefined && !(struct.name in struct)) {
                    structs[struct.name] = generateStruct(struct);
                }
            }
        }
    }
    return Object.values(structs);
}
function generateStruct(s) {
    const members = [];
    const tupleTypes = [];
    const tupleNames = [];
    for (const elem of s.elements) {
        tupleNames.push(elem[0]);
        tupleTypes.push(elem[1]);
        const tsType = tsTypeFromAbiType(elem[1]);
        members.push(factory.createPropertyDeclaration(undefined, undefined, factory.createIdentifier(elem[0]), undefined, tsType, defaultValueFromTsType(tsType)));
    }
    members.push(factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.StaticKeyword)], factory.createIdentifier('codec'), undefined, factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier('algosdk'), factory.createIdentifier('ABIType')), undefined), factory.createCallExpression(factory.createPropertyAccessExpression(factory.createPropertyAccessExpression(factory.createIdentifier('algosdk'), factory.createIdentifier('ABIType')), factory.createIdentifier('from')), undefined, [factory.createStringLiteral(`(${tupleTypes.join(',')})`)])));
    members.push(factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.StaticKeyword)], factory.createIdentifier('fields'), undefined, factory.createTypeReferenceNode('string[]'), factory.createArrayLiteralExpression(tupleNames.map((name) => {
        return factory.createStringLiteral(name);
    }))));
    members.push(
    // Add static `decodeResult(val: ABIValue): <T>` method
    factory.createMethodDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.StaticKeyword)], undefined, factory.createIdentifier('decodeResult'), undefined, undefined, [
        factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('val'), undefined, factory.createUnionTypeNode([
            factory.createTypeReferenceNode(factory.createQualifiedName(factory.createIdentifier('algosdk'), factory.createIdentifier('ABIValue')), undefined),
            factory.createTypeReferenceNode('undefined'),
        ]), undefined),
    ], factory.createTypeReferenceNode(factory.createIdentifier(s.name), undefined), factory.createBlock([
        factory.createReturnStatement(factory.createAsExpression(factory.createCallExpression(DECODE_NAMED_TUPLE_IDENT, undefined, [
            factory.createIdentifier('val'),
            factory.createPropertyAccessExpression(factory.createIdentifier(s.name), factory.createIdentifier('fields')),
        ]), factory.createTypeReferenceNode(factory.createIdentifier(s.name), undefined))),
    ], true)));
    members.push(factory.createMethodDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.StaticKeyword)], undefined, factory.createIdentifier('decodeBytes'), undefined, undefined, [
        factory.createParameterDeclaration(undefined, undefined, undefined, factory.createIdentifier('val'), undefined, UINT8_ARRAY_TYPE, undefined),
    ], factory.createTypeReferenceNode(factory.createIdentifier(s.name), undefined), factory.createBlock([
        factory.createReturnStatement(factory.createAsExpression(factory.createCallExpression(DECODE_NAMED_TUPLE_IDENT, undefined, [
            factory.createCallExpression(factory.createPropertyAccessExpression(factory.createPropertyAccessExpression(factory.createIdentifier(s.name), factory.createIdentifier('codec')), factory.createIdentifier('decode')), undefined, [factory.createIdentifier('val')]),
            factory.createPropertyAccessExpression(factory.createIdentifier(s.name), factory.createIdentifier('fields')),
        ]), factory.createTypeReferenceNode(factory.createIdentifier(s.name), undefined))),
    ], true)));
    return factory.createClassDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.ExportKeyword)], factory.createIdentifier(s.name), undefined, undefined, members);
}
function generateContractProperties(spec) {
    const descr = spec.contract.description;
    const methods = spec.contract.methods;
    const source = spec.source;
    const schema = spec.schema;
    // create desc property
    const descrProp = factory.createPropertyDeclaration(undefined, undefined, factory.createIdentifier('desc'), undefined, factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword), factory.createStringLiteral(descr ? descr : ''));
    // Create approval program property
    let approvalProp;
    if (source.approval !== undefined) {
        approvalProp = factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.OverrideKeyword)], factory.createIdentifier('approvalProgram'), undefined, factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword), factory.createStringLiteral(source.approval));
    }
    // Create clear program property
    let clearProp;
    if (source.clear !== undefined) {
        clearProp = factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.OverrideKeyword)], factory.createIdentifier('clearProgram'), undefined, factory.createKeywordTypeNode(typescript_1.default.SyntaxKind.StringKeyword), factory.createStringLiteral(source.clear));
    }
    // Create App Schema Property
    let appSchemaProp;
    if (schema.global !== undefined) {
        appSchemaProp = factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.OverrideKeyword)], factory.createIdentifier('appSchema'), undefined, SCHEMA_TYPE, copySchemaObject(schema.global));
    }
    // Create Acct schema property
    let acctSchemaProp;
    if (schema.local !== undefined) {
        acctSchemaProp = factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.OverrideKeyword)], factory.createIdentifier('acctSchema'), undefined, SCHEMA_TYPE, copySchemaObject(schema.local));
    }
    // Add methods
    const methodAssignments = [];
    for (const meth of methods) {
        const argObjs = meth.args.map((arg) => {
            return factory.createObjectLiteralExpression([
                objStrProperty('type', arg.type.toString()),
                objStrProperty('name', arg.name),
                objStrProperty('desc', arg.description),
            ]);
        });
        const returnObj = factory.createObjectLiteralExpression([
            objStrProperty('type', meth.returns.type.toString()),
            objStrProperty('desc', meth.returns.description),
        ]);
        // Create ABIMethod object
        methodAssignments.push(factory.createNewExpression(ABI_METHOD_IDENT, undefined, [
            factory.createObjectLiteralExpression([
                objStrProperty('name', meth.name),
                objStrProperty('desc', meth.description),
                factory.createPropertyAssignment(factory.createIdentifier('args'), factory.createArrayLiteralExpression(argObjs)),
                factory.createPropertyAssignment(factory.createIdentifier('returns'), returnObj),
            ]),
        ]));
    }
    // create methods property
    const methodProps = factory.createPropertyDeclaration(undefined, [factory.createModifier(typescript_1.default.SyntaxKind.OverrideKeyword)], factory.createIdentifier('methods'), undefined, factory.createArrayTypeNode(ABI_METHOD_TYPE), factory.createArrayLiteralExpression(methodAssignments, true));
    const props = [descrProp];
    if (appSchemaProp !== undefined)
        props.push(appSchemaProp);
    if (acctSchemaProp !== undefined)
        props.push(acctSchemaProp);
    if (approvalProp !== undefined)
        props.push(approvalProp);
    if (clearProp !== undefined)
        props.push(clearProp);
    props.push(methodProps);
    return props;
}
function objStrProperty(k, v) {
    const val = v === undefined ? '' : v;
    return factory.createPropertyAssignment(factory.createIdentifier(k), factory.createStringLiteral(val));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZ2VuZXJhdGUvZ2VuZXJhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBU0Esc0RBQThCO0FBQzlCLDREQUE0QjtBQUM1QixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsb0JBQUUsQ0FBQztBQUV2QixvQkFBb0I7QUFDcEIsOEJBQThCO0FBRTlCLE1BQU0sV0FBVyxHQUFHLHVCQUF1QixDQUFDO0FBQzVDLHNDQUFzQztBQUN0QyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBRWhDLE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQztBQUNsQyxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUM7QUFFL0IsTUFBTSxTQUFTLEdBQWEsQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRWhFLE1BQU0sU0FBUyxHQUFhO0lBQzFCLEtBQUs7SUFDTCxLQUFLO0lBQ0wsT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sUUFBUTtJQUNSLEtBQUs7Q0FDTixDQUFDO0FBRUYsZUFBZTtBQUNmLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFNUUsWUFBWTtBQUNaLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDdkUsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDMUUsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDaEYsTUFBTSxRQUFRLEdBQUcsT0FBTyxD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