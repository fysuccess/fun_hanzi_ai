export type KousuanType =
  | '5以内加法'
  | '5以内减法'
  | '5以内加减法'
  | '5以内加减法填括号'
  | '5以内加减法填括号混合'
  | '10以内加法'
  | '10以内减法'
  | '10以内加减法'
  | '10以内加减法填括号'
  | '10以内加减法填括号混合'
  | '20以内不进位加法'
  | '20以内不退位减法'
  | '20以内进位加法'
  | '20以内退位减法'
  | '20以内进位加法和退位减法'
  | '20以内加法'
  | '20以内减法'
  | '20以内加减法'
  | '20以内加减法填括号'
  | '20以内加减法填括号混合'
  | '100以内加法'
  | '100以内减法'
  | '100以内加减法'
  | '100以内加减法填括号'
  | '100以内加减法填括号混合';

export interface KousuanProblem {
  question: string;
  answer: number | string; // 数字或括号内应填的数字
  type: KousuanType;
  userAnswer?: string;
  correct?: boolean;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblemByType(type: KousuanType): KousuanProblem {
  switch (type) {
    case '5以内加法': {
      const a = randomInt(0, 5);
      const b = randomInt(0, 5);
      return {
        question: `${a}＋${b}＝（　　）`,
        answer: a + b,
        type,
      };
    }
    case '5以内减法': {
      const a = randomInt(0, 5);
      const b = randomInt(0, a);
      return {
        question: `${a}－${b}＝（　　）`,
        answer: a - b,
        type,
      };
    }
    case '5以内加减法': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 5);
        const b = randomInt(0, 5);
        return {
          question: `${a}＋${b}＝（　　）`,
          answer: a + b,
          type,
        };
      } else {
        const a = randomInt(0, 5);
        const b = randomInt(0, a);
        return {
          question: `${a}－${b}＝（　　）`,
          answer: a - b,
          type,
        };
      }
    }
    case '5以内加减法填括号': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 5);
        const b = randomInt(0, 5);
        const sum = a + b;
        // 随机决定括号位置
        if (Math.random() < 0.5) {
          return {
            question: `${a}＋（　　）＝${sum}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）＋${b}＝${sum}`,
            answer: a,
            type,
          };
        }
      } else {
        const a = randomInt(0, 5);
        const b = randomInt(0, a);
        const diff = a - b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}－（　　）＝${diff}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）－${b}＝${diff}`,
            answer: a,
            type,
          };
        }
      }
    }
    case '5以内加减法填括号混合': {
      // 混合类型，随机选择一种
      const subtypes = ['5以内加减法填括号', '5以内加减法'] as const;
      const subtype = subtypes[randomInt(0, subtypes.length - 1)];
      return generateProblemByType(subtype);
    }
    case '10以内加法': {
      const a = randomInt(0, 10);
      const b = randomInt(0, 10);
      return {
        question: `${a}＋${b}＝（　　）`,
        answer: a + b,
        type,
      };
    }
    case '10以内减法': {
      const a = randomInt(0, 10);
      const b = randomInt(0, a);
      return {
        question: `${a}－${b}＝（　　）`,
        answer: a - b,
        type,
      };
    }
    case '10以内加减法': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 10);
        const b = randomInt(0, 10);
        return {
          question: `${a}＋${b}＝（　　）`,
          answer: a + b,
          type,
        };
      } else {
        const a = randomInt(0, 10);
        const b = randomInt(0, a);
        return {
          question: `${a}－${b}＝（　　）`,
          answer: a - b,
          type,
        };
      }
    }
    case '10以内加减法填括号': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 10);
        const b = randomInt(0, 10);
        const sum = a + b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}＋（　　）＝${sum}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）＋${b}＝${sum}`,
            answer: a,
            type,
          };
        }
      } else {
        const a = randomInt(0, 10);
        const b = randomInt(0, a);
        const diff = a - b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}－（　　）＝${diff}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）－${b}＝${diff}`,
            answer: a,
            type,
          };
        }
      }
    }
    case '10以内加减法填括号混合': {
      const subtypes = ['10以内加减法填括号', '10以内加减法'] as const;
      const subtype = subtypes[randomInt(0, subtypes.length - 1)];
      return generateProblemByType(subtype);
    }
    case '20以内不进位加法': {
      // 个位相加小于10
      let a, b;
      do {
        a = randomInt(10, 20);
        b = randomInt(0, 9);
      } while ((a % 10) + (b % 10) >= 10);
      return {
        question: `${a}＋${b}＝（　　）`,
        answer: a + b,
        type,
      };
    }
    case '20以内不退位减法': {
      // 个位够减
      let a, b;
      do {
        a = randomInt(10, 20);
        b = randomInt(0, 9);
      } while (a % 10 < b % 10);
      return {
        question: `${a}－${b}＝（　　）`,
        answer: a - b,
        type,
      };
    }
    case '20以内进位加法': {
      // 个位相加大于等于10
      let a, b;
      do {
        a = randomInt(0, 20);
        b = randomInt(0, 20);
      } while ((a % 10) + (b % 10) < 10 || a + b > 20);
      return {
        question: `${a}＋${b}＝（　　）`,
        answer: a + b,
        type,
      };
    }
    case '20以内退位减法': {
      // 个位不够减，需要退位
      let a, b;
      do {
        a = randomInt(10, 20);
        b = randomInt(0, 9);
      } while (a % 10 >= b % 10 || a - b < 0);
      return {
        question: `${a}－${b}＝（　　）`,
        answer: a - b,
        type,
      };
    }
    case '20以内进位加法和退位减法': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        // 进位加法
        let a, b;
        do {
          a = randomInt(0, 20);
          b = randomInt(0, 20);
        } while ((a % 10) + (b % 10) < 10 || a + b > 20);
        return {
          question: `${a}＋${b}＝（　　）`,
          answer: a + b,
          type,
        };
      } else {
        // 退位减法
        let a, b;
        do {
          a = randomInt(10, 20);
          b = randomInt(0, 9);
        } while (a % 10 >= b % 10 || a - b < 0);
        return {
          question: `${a}－${b}＝（　　）`,
          answer: a - b,
          type,
        };
      }
    }
    case '20以内加法': {
      const a = randomInt(0, 20);
      const b = randomInt(0, 20 - a);
      return {
        question: `${a}＋${b}＝（　　）`,
        answer: a + b,
        type,
      };
    }
    case '20以内减法': {
      const a = randomInt(0, 20);
      const b = randomInt(0, a);
      return {
        question: `${a}－${b}＝（　　）`,
        answer: a - b,
        type,
      };
    }
    case '20以内加减法': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 20);
        const b = randomInt(0, 20 - a);
        return {
          question: `${a}＋${b}＝（　　）`,
          answer: a + b,
          type,
        };
      } else {
        const a = randomInt(0, 20);
        const b = randomInt(0, a);
        return {
          question: `${a}－${b}＝（　　）`,
          answer: a - b,
          type,
        };
      }
    }
    case '20以内加减法填括号': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 20);
        const b = randomInt(0, 20 - a);
        const sum = a + b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}＋（　　）＝${sum}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）＋${b}＝${sum}`,
            answer: a,
            type,
          };
        }
      } else {
        const a = randomInt(0, 20);
        const b = randomInt(0, a);
        const diff = a - b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}－（　　）＝${diff}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）－${b}＝${diff}`,
            answer: a,
            type,
          };
        }
      }
    }
    case '20以内加减法填括号混合': {
      const subtypes = ['20以内加减法填括号', '20以内加减法'] as const;
      const subtype = subtypes[randomInt(0, subtypes.length - 1)];
      return generateProblemByType(subtype);
    }
    case '100以内加法': {
      const a = randomInt(0, 100);
      const b = randomInt(0, 100 - a);
      return {
        question: `${a}＋${b}＝（　　）`,
        answer: a + b,
        type,
      };
    }
    case '100以内减法': {
      const a = randomInt(0, 100);
      const b = randomInt(0, a);
      return {
        question: `${a}－${b}＝（　　）`,
        answer: a - b,
        type,
      };
    }
    case '100以内加减法': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 100);
        const b = randomInt(0, 100 - a);
        return {
          question: `${a}＋${b}＝（　　）`,
          answer: a + b,
          type,
        };
      } else {
        const a = randomInt(0, 100);
        const b = randomInt(0, a);
        return {
          question: `${a}－${b}＝（　　）`,
          answer: a - b,
          type,
        };
      }
    }
    case '100以内加减法填括号': {
      const isAdd = Math.random() < 0.5;
      if (isAdd) {
        const a = randomInt(0, 100);
        const b = randomInt(0, 100 - a);
        const sum = a + b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}＋（　　）＝${sum}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）＋${b}＝${sum}`,
            answer: a,
            type,
          };
        }
      } else {
        const a = randomInt(0, 100);
        const b = randomInt(0, a);
        const diff = a - b;
        if (Math.random() < 0.5) {
          return {
            question: `${a}－（　　）＝${diff}`,
            answer: b,
            type,
          };
        } else {
          return {
            question: `（　　）－${b}＝${diff}`,
            answer: a,
            type,
          };
        }
      }
    }
    case '100以内加减法填括号混合': {
      const subtypes = ['100以内加减法填括号', '100以内加减法'] as const;
      const subtype = subtypes[randomInt(0, subtypes.length - 1)];
      return generateProblemByType(subtype);
    }
    default:
      // fallback
      return {
        question: `1＋1＝（　　）`,
        answer: 2,
        type: '5以内加法',
      };
  }
}

export function generateKousuanProblems(
  count: number,
  types: KousuanType[] = []
): KousuanProblem[] {
  console.log('generateKousuanProblems called with count', count, 'types', types.length);
  const allTypes: KousuanType[] = [
    '5以内加法',
    '5以内减法',
    '5以内加减法',
    '5以内加减法填括号',
    '5以内加减法填括号混合',
    '10以内加法',
    '10以内减法',
    '10以内加减法',
    '10以内加减法填括号',
    '10以内加减法填括号混合',
    '20以内不进位加法',
    '20以内不退位减法',
    '20以内进位加法',
    '20以内退位减法',
    '20以内进位加法和退位减法',
    '20以内加法',
    '20以内减法',
    '20以内加减法',
    '20以内加减法填括号',
    '20以内加减法填括号混合',
    '100以内加法',
    '100以内减法',
    '100以内加减法',
    '100以内加减法填括号',
    '100以内加减法填括号混合',
  ];

  const selectedTypes = types.length > 0 ? types : allTypes;
  const problems: KousuanProblem[] = [];

  for (let i = 0; i < count; i++) {
    const type = selectedTypes[randomInt(0, selectedTypes.length - 1)];
    problems.push(generateProblemByType(type));
  }
  console.log('generated', problems.length, 'problems');
  return problems;
}

export function calculateScore(problems: KousuanProblem[]): {
  correct: number;
  total: number;
  percentage: number;
} {
  let correct = 0;
  problems.forEach((p) => {
    if (p.correct) correct++;
  });
  const total = problems.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { correct, total, percentage };
}
