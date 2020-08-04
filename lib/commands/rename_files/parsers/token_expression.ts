enum TBracketIdentity {
  LeftBracket,
  RightBracket,
  Other,
}

export function generateInterpolatedString(
  varName: string,
  pattern: string,
): string {
  const patternBuffer: string[] = pattern.split("");
  const expression: string[] = [];
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
          expression.push("${" + varName + "['" + token.join("") + "']}");
          token = [];
        }
        break;
      default:
        if (insideToken) {
          token.push(patternBuffer[i]);
        } else {
          expression.push(patternBuffer[i]);
        }
        break;
    }
  }

  // Swallow the bracket but include all other characters if the pattern was malformed.
  if (insideToken) {
    expression.push(token.join(""));
  }

  return "`" + expression.join("") + "`";
}

export function identifyCharacter(char: string): TBracketIdentity {
  const reLeftBracket = /{/ig;
  const reRightBracket = /}/ig;

  if (char.match(reLeftBracket) !== null) {
    return TBracketIdentity.LeftBracket;
  } else if (char.match(reRightBracket) !== null) {
    return TBracketIdentity.RightBracket;
  } else {
    return TBracketIdentity.Other;
  }
}

export const __private__ = {
  TBracketIdentity,
};
