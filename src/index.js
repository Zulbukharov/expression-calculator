function eval() {
  // Do not use eval!!!
  return;
}

const isOperator = token =>
  token === "+" || token === "-" || token === "*" || token === "/";

const greaterPrecedence = (o, n) =>
  (n === "-" || n === "+") && (o === "/" || o === "*");

const equalPrecedence = (o, n) =>
  ((o === "+" || o === "-") && (n === "-" || n === "+")) ||
  ((o === "*" || o === "/") && (n === "*" || n === "/"));

const top = arr => arr[arr.length - 1];

const evaluate = (f, l, o) => {
  f = Number(f);
  l = Number(l);
  if (o === "+") return f + l;
  else if (o === "-") return f - l;
  else if (o === "/" && l === 0) throw "TypeError: Division by zero.";
  else if (o === "/") return f / l;
  else return f * l;
};

class Token {
  constructor() {
    this.inst = null;
    this.tokens = [];
  }
  static getInst() {
    if (!this.inst) this.inst = new Token();
    return this.inst;
  }
  tokenize(str) {
    str = str.trim();
    var s = "";
    for (var index = 0; index < str.length; index++) {
      s += str[index];
      const peek = str[index + 1];
      if (!isNaN(s.trim()) && isNaN(peek)) {
        this.tokens.push(s.trim());
        s = "";
      }
      if (s.trim() == "(" || s.trim() == ")") {
        s.trim() == "(" ? this.tokens.push("(") : this.tokens.push(")");
        s = "";
      }
      if (isOperator(s.trim()) && !isOperator(peek)) {
        this.tokens.push(s.trim());
        s = "";
      }
    }
    return this.tokens;
  }
}

// https://en.wikipedia.org/wiki/Reverse_Polish_notation
const postfixEvalutation = postfixExpression => {
  let stack = [];
  // for each token in the postfix expression:
  postfixExpression.forEach(token => {
    // if token is an operator:
    if (isOperator(token)) {
      // operand_2 ← pop from the stack
      let operand2 = stack.pop();
      // operand_1 ← pop from the stack
      let operand1 = stack.pop();
      // result ← evaluate token with operand_1 and operand_2
      // push result back onto the stack
      stack.push(evaluate(operand1, operand2, token));
      // else if token is an operand:
    } else {
      // push token onto the stack
      stack.push(token);
    }
  });
  //   console.log(stack);
  return stack.pop();
  //   result ← pop from the stack
};

// from infix to postfix
// https://en.wikipedia.org/wiki/Shunting-yard_algorithm
function expressionCalculator(expr) {
  let operatorStack = [];
  let outputQueue = [];

  expr = new Token().tokenize(expr);
  expr.forEach(token => {
    if (token === "") return;
    // console.log(token);
    // if the token is a number, then:
    if (!isNaN(token))
      // push it to the output queue.
      outputQueue.push(token);

    // if the token is an operator, then:
    if (isOperator(token)) {
      // (there is an operator at the top of the operator stack with greater precedence)
      // or (the operator at the top of the operator stack has equal precedence and the token
      // is left associative))
      // and (the operator at the top of the operator stack is not a left parenthesis):
      while (
        (greaterPrecedence(top(operatorStack), token) ||
          equalPrecedence(top(operatorStack), token)) &&
        top(operatorStack) !== "("
      ) {
        // pop operators from the operator stack onto the output queue.
        outputQueue.push(operatorStack.pop());
      }
      // push it onto the operator stack.
      operatorStack.push(token);
    }

    // if the token is a left paren (i.e. "("), then:
    if (token === "(")
      // push it onto the operator stack.
      operatorStack.push(token);

    // if the token is a right paren (i.e. ")"), then:
    if (token === ")") {
      if (operatorStack.indexOf("(") === -1)
        throw "ExpressionError: Brackets must be paired";
      // while the operator at the top of the operator stack is not a left paren:
      while (top(operatorStack) !== "(") {
        // pop the operator from the operator stack onto the output queue.
        outputQueue.push(operatorStack.pop());
      }

      // if there is a left paren at the top of the operator stack, then:
      if (top(operatorStack) === "(")
        // pop the operator from the operator stack and discard it
        operatorStack.pop();
    }
  });
  /* After while loop, if operator stack not null, pop everything to output queue */
  // if there are no more tokens to read then:
  // while there are still operator tokens on the stack:
  //   console.log(operatorStack);
  //   console.log(operatorStack.indexOf(")"));
  if (operatorStack.indexOf(")") !== -1 || operatorStack.indexOf("(") !== -1)
    throw "ExpressionError: Brackets must be paired";
  while (top(operatorStack)) {
    outputQueue.push(operatorStack.pop());
  }
  // /* If the operator token on the top of the stack is a paren, then there are mismatched parentheses. */
  // pop the operator from the operator stack onto the output queue.
  // exit.
  //   console.log(outputQueue);
  //   if (operatorStack.length > 0)
  // throw "ExpressionError: Brackets must be paired";
  // console.log(postfixEvalutation(outputQueue));
  return postfixEvalutation(outputQueue);
}

module.exports = {
  expressionCalculator
};
