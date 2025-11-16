export type TokenType =
  | "SOF"
  | "NUMBER"
  | "STRING"
  | "IDENTIFIER"
  | "LET"
  | "CONST"
  | "PLUS"
  | "MINUS"
  | "STAR"
  | "SLASH"
  | "EQUAL"
  | "LPAREN"
  | "RPAREN"
  | "LBRACE"
  | "RBRACE"
  | "SEMICOLON"
  | "LOG"
  | "EOF";


export interface Token {
    type: TokenType;
    value: string;
}

export class Lexer {
  private pos = 0;
  private current: string | null;

  constructor(private input: string){
    this.current= this.input[0] ?? null;
  }
  
  private advance(){
    this.pos++;
    this.current = this.pos < this.input.length ? this.input[this.pos] : null;
  }

  private skipWhiteSpace(){
    while(this.current !== null && /\s/.test(this.current)){
      this.advance()
    }
  }

  private number(): Token {
    let num = ""
    while(this.current !== null && /[0-9]/.test(this.current)){
      num += this.current;
      this.advance();
    }
    return {type: "NUMBER" , value : num}
  }

  private string(): Token{
    let str = ""
    this.advance()

    while(this.current !== null && this.current !== '"'){
      str += this.current;
      this.advance()
    }
    this.advance()
    return {type:"STRING",value:str}
  }

  private identifier(): Token {
    let id = ""
    while(this.current !== null && /[a-zA-z]/.test(this.current)){
      id += this.current;
      this.advance();
    }
    if(id === "say") return {type:"LOG", value:id}
    if (id === "gtg") return {type: "EOF", value: ""};
    if(id === "bestie") return {type:"SOF", value: id}  
    if (id === "periodt") return { type: "CONST" , value : id}

    return {type: "IDENTIFIER" , value :id}
  }

  nextToken(): Token {
    this.skipWhiteSpace();

    if (this.current === null) {
      return { type: "EOF", value: "" };
    }

    if (/[0-9]/.test(this.current)) {
      return this.number();
    }

    if(this.current === '"'){
      return this.string()
    }

    if (/[a-zA-Z_]/.test(this.current)) {
      return this.identifier();
    }
    
    const char = this.current;
    this.advance();

     switch (char) {
      case "+": return { type: "PLUS", value: "+" };
      case "-": return { type: "MINUS", value: "-" };
      case "*": return { type: "STAR", value: "*" };
      case "/": return { type: "SLASH", value: "/" };
      case "=": return { type: "EQUAL", value: "=" };
      case "(": return { type: "LPAREN", value: "(" };
      case ")": return { type: "RPAREN", value: ")" };
      case "{": return { type: "LBRACE", value: "{" };
      case "}": return { type: "RBRACE", value: "}" };
      case ";": return { type: "SEMICOLON", value: ";" };
    }
    throw new Error(`Unexpected character: ${char}`);
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    let token: Token;

    do {
      token = this.nextToken();
      tokens.push(token);
    } while (token.type !== "EOF");

    return tokens;
  }
}