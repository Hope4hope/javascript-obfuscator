import * as estraverse from 'estraverse';

import { INode } from "../../interfaces/nodes/INode";

import { NodeType } from "../../enums/NodeType";

import { Node } from '../Node';
import { NodeUtils } from "../../NodeUtils";

export class UnicodeArrayRotateFunctionCallNode extends Node {
    /**
     * @type {string}
     */
    private unicodeArrayName: string;

    /**
     * @type {number}
     */
    private unicodeArrayRotateValue: number;

    /**
     * @param {string}
     */
    private unicodeArrayRotateFunctionName: string;

    /**
     * @param unicodeArrayRotateFunctionName
     * @param unicodeArrayName
     * @param unicodeArrayRotateValue
     */
    constructor (
        unicodeArrayRotateFunctionName: string,
        unicodeArrayName: string,
        unicodeArrayRotateValue: number
    ) {
        super();

        this.unicodeArrayRotateFunctionName = unicodeArrayRotateFunctionName;
        this.unicodeArrayName = unicodeArrayName;
        this.unicodeArrayRotateValue = unicodeArrayRotateValue;

        this.node = this.getNodeStructure();
    }

    public appendNode (astTree: INode): void {
        estraverse.replace(astTree, {
            leave: (node: INode, parent: INode): any => {
                if (NodeUtils.isProgramNode(node)) {
                    NodeUtils.prependNode(node.body, this.getNode());

                    return estraverse.VisitorOption.Break;
                }

                return estraverse.VisitorOption.Skip;
            }
        });
    }

    /**
     * @returns any
     */
    protected getNodeStructure (): any {
        return {
            'type': NodeType.ExpressionStatement,
            'expression': {
                'type': NodeType.CallExpression,
                'callee': {
                    'type': NodeType.Identifier,
                    'name': this.unicodeArrayRotateFunctionName
                },
                'arguments': [
                    {
                        'type': NodeType.Identifier,
                        'name': this.unicodeArrayName
                    },
                    {
                        'type': NodeType.Literal,
                        'value': this.unicodeArrayRotateValue,
                        'raw': `'${this.unicodeArrayRotateValue}'`
                    },
                    {
                        'type': NodeType.Literal,
                        'value': true,
                        'raw': 'true'
                    }
                ]
            }
        };
    }
}