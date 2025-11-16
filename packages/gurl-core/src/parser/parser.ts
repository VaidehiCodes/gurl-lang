import { Token,TokenType } from "../lexer/lexer";
import { 
  Program,
  Identifier,
  NumberLiteral,
  LetStatement,
  ConstStatement,
  ExpressionStatement,
  BinaryExpression,
  ASTNode,
  LogStatement,
 } from "../ast/nodes";

export class Parser {
    private pos = 0;

    constructor(private tokens: Token[]){}

    private peek(): Token{
     return this.tokens[this.pos]
    }

    private consume(type: TokenType){
        const token = this.peek()
        if (token.type !== type){
            throw new Error(`Expected ${type}, got ${token.type}`)
        }
        this.pos++;
        return token
    }

    parseProgram(): Program{
        const body: ASTNode[] =[]

        while(this.peek().type !== "EOF"){
            body.push(this.parseStatement())
        }
        return {type: "Program", body}
    }

    parseStatement(): ASTNode {
        if(this.peek().type == "SOF"){
            this.consume("SOF")
        }
        if(this.peek().type == "CONST"){
            return this.parseConstStatement()
        }
        if(this.peek().type == "LOG"){
            return this.parseLogStatement()
        }
        return this.parseExressionStatement()       
    }
    
    parseLogStatement(): LogStatement{
        this.consume("LOG")

        const expr = this.parseExpression();
        if (this.peek().type === "SEMICOLON") this.consume("SEMICOLON");

        return{ type :"LogStatemenet" , expression:expr}
    }
    
    parseConstStatement(): ConstStatement{
        this.consume("CONST")

        const name = this.consume("IDENTIFIER")
        this.consume("EQUAL")
        const value = this.parseExpression()

        if (this.peek().type === "SEMICOLON") this.consume("SEMICOLON");

        return {
            type: "ConstStatement",
            name: { type: "Identifier", name: name.value },
            value,
    };

    }

    parseExressionStatement(): ExpressionStatement{
        const expr = this.parseExpression()
        if(this.peek().type === "SEMICOLON") this.consume("SEMICOLON")

        return {type:"ExpressionStatement",expression:expr}
    }

    parseExpression(): ASTNode{
        return this.parseAddition();
    }

    parseAddition(): ASTNode {
        let left = this.parseMultiplication();

        while(this.peek().type === "PLUS" || this.peek().type === "MINUS"){
            const operator = this.consume(this.peek().type).value;
            const right = this.parseMultiplication();
            left = {type: "BinaryExpression",left,operator,right}
        }
        return left;
    }

    parseMultiplication(): ASTNode{
        let left = this.parsePrimary()

        while(this.peek().type === "STAR" || this.peek().type === "SLASH"){
            const operator = this.consume(this.peek().type).value;
            const right = this.parsePrimary();
            left = {type:"BinaryExpression",left , operator, right}
        }
        return left
    }

    parsePrimary(): ASTNode{
        const token = this.peek()

        if(token.type === "NUMBER"){
            this.consume("NUMBER")
            return {type:"NumberLiteral",value:Number(token.value)}
        }

        if(token.type === "STRING"){
            this.consume("STRING")
            return {type:"StringLiteral", value:token.value}
        }


        if (token.type === "IDENTIFIER") {
        this.consume("IDENTIFIER");
        return { type: "Identifier", name: token.value };
        }

        if(token.type === "EQUAL"){
            this.consume("EQUAL");
            return this.parseExpression();
        }

        if (token.type === "LPAREN") {
        this.consume("LPAREN");
        const expr = this.parseExpression();
        this.consume("RPAREN");
        return expr;
        }
      throw new Error(`Unexpected token: ${token.type}`); 
    }
}
