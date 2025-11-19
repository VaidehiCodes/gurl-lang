import { Interpreter } from "./interpreter/interpreter";
import { Lexer } from "./lexer/lexer";
import { Parser } from "./parser/parser";

const code = `
  bestie

  periodt x = 10 + 20;
  say x * 2;

  spill(x < 2){
    say "hell nah"
  } nvm {
   say "vinesh gandu"
  }
  gtg
`;

const tokens = new Lexer(code).tokenize();
const parser = new Parser(tokens);
const ast = parser.parseProgram();

const interpreter = new Interpreter();
interpreter.interpret(ast);