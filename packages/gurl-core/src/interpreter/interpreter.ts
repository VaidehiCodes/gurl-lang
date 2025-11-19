import { 
Program,
ConstStatement,
BinaryExpression,
NumberLiteral,
StringLiteral,
Identifier,
ExpressionStatement,
IfStatement,
ASTNode
} from "../ast/nodes";

export class Interpreter{
    private env: Record<string,any> = {}

    interpret(program:Program) {
        let result:any

        for(const node of program.body){
            result = this.eval(node)
        }
        return result;
    }

    eval(node:ASTNode): any{
        switch(node.type){
            case "Program":
                return this.interpret(node);
            
            case "NumberLiteral":
                return node.value;
            
            case "Identifier":
                if(!(node.name in this.env)){
                    throw new Error(`Undefined variable: ${node.name}`);
                }
                return this.env[node.name];
            
            case "BinaryExpression":
                return this.binaryEval(node);

            case "StringLiteral":
                return node.value;

            case "IfStatement":
                const cond = this.eval(node.condition)

                if (cond) {
                    let result 
                    for (const st of node.thenBranch){
                        result = this.eval(st)
                    }
                    return result
                    } else if (node.elseBranch){
                        let result;

                        for(const st of node.thenBranch){
                            result = this.eval(st)
                        }
                        return result
                    }
                    return null;

            case "ExpressionStatement":
                return this.eval(node.expression)
            
            case "ConstStatement":
                if(node.name.name in this.env){
                    throw new Error(`Cannot redeclare constant: ${node.name.name}`);
                }
                this.env[node.name.name] = this.eval(node.value);
                return this.env[node.name.name];

            case "LogStatemenet":
                const logVaule = this.eval(node.expression)
                console.log(logVaule)
                return logVaule
        }
    }   

    binaryEval(node:BinaryExpression):any{
        const left = this.eval(node.left)
        const right = this.eval(node.right)

        switch(node.operator){
            case "+": return left + right;
            case "-": return left - right;
            case "/": return left / right;
            case "*": return left * right;
            case "<": return left < right;
            case ">": return left > right;
            case ">=": return left >= right;
            case "<=": return left <= right;
            case "==": return left == right;
            case "!=": return left != right;
        }

         throw new Error(`Unknown operator: ${node.operator}`);
    }
}