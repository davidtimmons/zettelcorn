/// TYPES ///

export enum TTokenExpBracket {
  LeftBracket,
  RightBracket,
  Other,
}

/// LOGIC ///

const LEFT_BRACKET = /{/ig;
const RIGHT_BRACKET = /}/ig;

export function hasTokenExp(pattern: string): boolean {
  const leftBracket = pattern.search(LEFT_BRACKET);
  const rightBracket = pattern.search(RIGHT_BRACKET);
  return leftBracket >= 0 && rightBracket >= 0 && leftBracket < rightBracket;
}

/**
 * Given a token expression, generate a getter function that will populate a template string
 * with data extracted from an object argument.
 * @example
 * // returns function(data) { return `this-${data.id}.md` }
 * generateGetterFromTokenExp("this-{id}.md")
 */
export function generateGetterFromTokenExp(pattern: string): Function {
  return Function(
    "data",
    "return " + generateTemplateStrFromTokenExp("data", pattern),
  );
}

/**
 * Given a token expression, generate a JavaScript template string. The generated string assumes
 * variables are populated based on object access.
 * @example
 * // returns `this-${yaml.id}.md`
 * generateTemplateStrFromTokenExp("yaml", "this-{id}.md")
 */
export function generateTemplateStrFromTokenExp(
  varName: string,
  pattern: string,
): string {
  const patternBuffer: string[] = pattern.split("");
  const resultBuffer: string[] = [];
  let token: string[] = [];
  let insideToken = false;

  for (let i = 0; i < patternBuffer.length; i += 1) {
    const id = identifyBracket(patternBuffer[i]);
    switch (id) {
      case TTokenExpBracket.LeftBracket:
        insideToken = true;
        break;
      case TTokenExpBracket.RightBracket:
        // This is only a token if there was a left bracket. Otherwise, the pattern is malformed.
        if (insideToken) {
          insideToken = false;
          resultBuffer.push("${" + varName + "['" + token.join("") + "']}");
          token = [];
        }
        break;
      default:
        if (insideToken) {
          token.push(patternBuffer[i]);
        } else {
          resultBuffer.push(patternBuffer[i]);
        }
        break;
    }
  }

  // Swallow the bracket but include all other characters if the pattern was malformed.
  if (insideToken) {
    resultBuffer.push(token.join(""));
  }

  return "`" + resultBuffer.join("") + "`";
}

export function identifyBracket(char: string): TTokenExpBracket {
  if (char.match(LEFT_BRACKET) !== null) {
    return TTokenExpBracket.LeftBracket;
  } else if (char.match(RIGHT_BRACKET) !== null) {
    return TTokenExpBracket.RightBracket;
  } else {
    return TTokenExpBracket.Other;
  }
}
