/// TYPES ///

enum TBracketIdentity {
  LeftBracket,
  RightBracket,
  Other,
}

/// LOGIC ///

const LEFT_BRACKET = /{/ig;
const RIGHT_BRACKET = /}/ig;

export function hasToken(pattern: string): boolean {
  const leftBracket = pattern.search(LEFT_BRACKET);
  const rightBracket = pattern.search(RIGHT_BRACKET);
  return leftBracket >= 0 && rightBracket >= 0 && leftBracket < rightBracket;
}

export function generateInterpolatedString(
  varName: string,
  pattern: string,
): string {
  const patternBuffer: string[] = pattern.split("");
  const resultBuffer: string[] = [];
  let token: string[] = [];
  let insideToken = false;

  for (let i = 0; i < patternBuffer.length; i += 1) {
    const id = identifyCharacter(patternBuffer[i]);
    switch (id) {
      case TBracketIdentity.LeftBracket:
        insideToken = true;
        break;
      case TBracketIdentity.RightBracket:
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

export function identifyCharacter(char: string): TBracketIdentity {
  if (char.match(LEFT_BRACKET) !== null) {
    return TBracketIdentity.LeftBracket;
  } else if (char.match(RIGHT_BRACKET) !== null) {
    return TBracketIdentity.RightBracket;
  } else {
    return TBracketIdentity.Other;
  }
}

export const __private__ = {
  TBracketIdentity,
};
