import chai from 'chai';
import { openFile } from '../src/utils.js';
import { compile } from '../src/sel.js';

const expect = chai.expect;

const SelSymbol = name => `(let ${name} (λ _ _))`;

const run = async (statment, customJS) => {
  const base = await openFile('../src/base.sel');
  const js = await compile(`
    ${base}
    ${statment}
  `);
  return eval(`
    ${customJS}
    ${js}
  `);
};

const TruthSymbol = 'T_TRUE';
const FalseSymbol = 'T_FALSE';

describe('Boolean logic', () => {

  describe('True', () => {
    it('should return the first arguemnt passed', async () => {
      const result = await run(`
        ${SelSymbol('SymbolA')}
        ${SelSymbol('SymbolB')}
        ((True SymbolA) SymbolB)
      `);
      expect(result.name).to.equal('SymbolA');
    });
  });

  describe('False', () => {
    it('should return the second arguemnt passed', async () => {
      const result = await run(`
        ${SelSymbol('SymbolA')}
        ${SelSymbol('SymbolB')}
        ((False SymbolA) SymbolB)
      `);
      expect(result.name).to.equal('SymbolB');
    });
  });

  describe('And', () => {
    it('should only return true if both sides are true', async () => {
      expect((await run(`((∧ True) True)`)).name).to.equal(TruthSymbol);
      expect((await run(`((∧ False) True)`)).name).to.equal(FalseSymbol);
      expect((await run(`((∧ True) False)`)).name).to.equal(FalseSymbol);
      expect((await run(`((∧ False) False)`)).name).to.equal(FalseSymbol);
    });
  });

  describe('Or', () => {
    it('should return true if of of the sides is true', async () => {
      expect((await run(`((∨ True) True)`)).name).to.equal(TruthSymbol);
      expect((await run(`((∨ False) True)`)).name).to.equal(TruthSymbol);
      expect((await run(`((∨ True) False)`)).name).to.equal(TruthSymbol);
      expect((await run(`((∨ False) False)`)).name).to.equal(FalseSymbol);
    });
  });

  describe('Not', () => {
    it('should reverse the symbol', async () => {
      expect((await run(`(¬ True)`)).name).to.equal(FalseSymbol);
      expect((await run(`(¬ False)`)).name).to.equal(TruthSymbol);
    });
  });

  describe('If', () => {
    it('Should return the left side when the pre-condition is true', async () => {
      const result = await run(`
        ${SelSymbol('SymbolA')}
        ${SelSymbol('SymbolB')}
        (((If True) SymbolA) SymbolB)
      `);
      expect(result.name).to.equal('SymbolA');
    });
    it('Should return the right side when the pre-condition is false', async () => {
      const result = await run(`
        ${SelSymbol('SymbolA')}
        ${SelSymbol('SymbolB')}
        (((If False) SymbolA) SymbolB)
      `);
      expect(result.name).to.equal('SymbolB');
    });
  });

});

describe('Numerals', () => {

  const counter = `
    let counter = 0;
    const count = () => counter++;
  `;

  describe('A Number', async () => {
    it('should return a lambda that will call its parameter N times', async () => {
      const n = 8;
      const result = await run(`
        ((${n} count) ∅)
        counter
      `, counter);
      expect(result).to.equal(n);
    });
  });

  describe('Successor', () => {
    it('Should increase N by 1', async () => {
      const n = 8;
      expect(await run(`(toJSNumber (Successor ${n}))`)).to.equal(n + 1);
    });
  });

  describe('Predecessor', () => {
    it('Should decrease N by 1', async () => {
      const n = 8;
      expect(await run(`(toJSNumber (Predecessor ${n}))`)).to.equal(n - 1);
    });
  });

  describe('+', () => {
    it('Should add two given numbers', async () => {
      const n1 = 2;
      const n2 = 3;
      const result = await run(`(toJSNumber ((+ ${n1}) ${n2}))`);
      expect(result).to.equal(n1 + n2);
    });
  });

  describe('-', () => {
    it('Should reduce a number from a given number', async () => {
      const n1 = 10;
      const n2 = 3;
      const result = await run(`(toJSNumber ((- ${n1}) ${n2}))`);
      expect(result).to.equal(n1 - n2);
    });
  });

  describe('*', () => {
    it('Should multiply two given numbers', async () => {
      const n1 = 2;
      const n2 = 3;
      const result = await run(`(toJSNumber ((* ${n1}) ${n2}))`);
      expect(result).to.equal(n1 * n2);
    });
  });

  describe('Power', () => {
    it('Should return the power of two given numbers', async () => {
      const n1 = 2;
      const n2 = 3;
      const result = await run(`(toJSNumber ((Power ${n1}) ${n2}))`);
      expect(result).to.equal(8);
    });
  });

  describe('Abs-Difference', () => {
    it('Should return the absolute difference of two numbers', async () => {
      const n1 = 2;
      const n2 = 3;
      const result = await run(`(toJSNumber ((Abs-Difference ${n1}) ${n2}))`);
      expect(result).to.equal(1);
    });
  });

});


describe('Comparison', () => {

  describe('Is-Zero', () => {
    it('should return True if the input is zero', async () => {
      const result = await run('(Is-Zero 0)');
      expect(result.name).to.equal(TruthSymbol);
    });
    it('should return False if the input is not zero', async () => {
      expect((await run('(Is-Zero 1)')).name).to.equal(FalseSymbol);
      expect((await run('(Is-Zero 2)')).name).to.equal(FalseSymbol);
      expect((await run('(Is-Zero 3)')).name).to.equal(FalseSymbol);
      expect((await run('(Is-Zero 4)')).name).to.equal(FalseSymbol);
      expect((await run('(Is-Zero 5)')).name).to.equal(FalseSymbol);
    });
  });

  describe('<', () => {
    it('should return True if the left side is less than the right side', async () => {
      expect((await run('((< 1) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((< 2) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((< 7) 9)')).name).to.equal(TruthSymbol);
    });
    it('should return False if the left side is greater than the right side', async () => {
      expect((await run('((< 9) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((< 8) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((< 4) 1)')).name).to.equal(FalseSymbol);
    });
    it('should return False if both sides are equal', async () => {
      expect((await run('((< 1) 1)')).name).to.equal(FalseSymbol);
      expect((await run('((< 2) 2)')).name).to.equal(FalseSymbol);
      expect((await run('((< 3) 3)')).name).to.equal(FalseSymbol);
    });
  });

  describe('≤', () => {
    it('should return True if the left side is less than the right side', async () => {
      expect((await run('((≤ 1) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((≤ 2) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((≤ 7) 9)')).name).to.equal(TruthSymbol);
    });
    it('should return False if the left side is greater than the right side', async () => {
      expect((await run('((≤ 9) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((≤ 8) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((≤ 4) 1)')).name).to.equal(FalseSymbol);
    });
    it('should return True if both sides are equal', async () => {
      expect((await run('((≤ 1) 1)')).name).to.equal(TruthSymbol);
      expect((await run('((≤ 2) 2)')).name).to.equal(TruthSymbol);
      expect((await run('((≤ 3) 3)')).name).to.equal(TruthSymbol);
    });
  });

  describe('=', () => {
    it('should return True if both sides are equal', async () => {
      expect((await run('((= 1) 1)')).name).to.equal(TruthSymbol);
      expect((await run('((= 2) 2)')).name).to.equal(TruthSymbol);
      expect((await run('((= 3) 3)')).name).to.equal(TruthSymbol);
    });
    it('should return False if the sides are not equal', async () => {
      expect((await run('((= 2) 1)')).name).to.equal(FalseSymbol);
      expect((await run('((= 1) 2)')).name).to.equal(FalseSymbol);
      expect((await run('((= 4) 7)')).name).to.equal(FalseSymbol);
    });
  });

  describe('≠', () => {
    it('should return False if both sides are equal', async () => {
      expect((await run('((≠ 1) 1)')).name).to.equal(FalseSymbol);
      expect((await run('((≠ 2) 2)')).name).to.equal(FalseSymbol);
      expect((await run('((≠ 3) 3)')).name).to.equal(FalseSymbol);
    });
    it('should return True if the sides are not equal', async () => {
      expect((await run('((≠ 2) 1)')).name).to.equal(TruthSymbol);
      expect((await run('((≠ 1) 2)')).name).to.equal(TruthSymbol);
      expect((await run('((≠ 4) 7)')).name).to.equal(TruthSymbol);
    });
  });

  describe('>', () => {
    it('should return False if the left side is less than the right side', async () => {
      expect((await run('((> 1) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((> 2) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((> 7) 9)')).name).to.equal(FalseSymbol);
    });
    it('should return True if the left side is greater than the right side', async () => {
      expect((await run('((> 9) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((> 8) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((> 4) 1)')).name).to.equal(TruthSymbol);
    });
    it('should return False if both sides are equal', async () => {
      expect((await run('((> 1) 1)')).name).to.equal(FalseSymbol);
      expect((await run('((> 2) 2)')).name).to.equal(FalseSymbol);
      expect((await run('((> 3) 3)')).name).to.equal(FalseSymbol);
    });
  });

  describe('≥', () => {
    it('should return False if the left side is less than the right side', async () => {
      expect((await run('((≥ 1) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((≥ 2) 5)')).name).to.equal(FalseSymbol);
      expect((await run('((≥ 7) 9)')).name).to.equal(FalseSymbol);
    });
    it('should return True if the left side is greater than the right side', async () => {
      expect((await run('((≥ 9) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((≥ 8) 5)')).name).to.equal(TruthSymbol);
      expect((await run('((≥ 4) 1)')).name).to.equal(TruthSymbol);
    });
    it('should return True if both sides are equal', async () => {
      expect((await run('((≥ 1) 1)')).name).to.equal(TruthSymbol);
      expect((await run('((≥ 2) 2)')).name).to.equal(TruthSymbol);
      expect((await run('((≥ 3) 3)')).name).to.equal(TruthSymbol);
    });
  });

  describe('∅', () => {
    it('should always return True', async () => {
      expect((await run('(∅ True)')).name).to.equal(TruthSymbol);
      expect((await run('(∅ False)')).name).to.equal(TruthSymbol);
      expect((await run('(∅ 1)')).name).to.equal(TruthSymbol);
      expect((await run('(∅ ∅)')).name).to.equal(TruthSymbol);
    });
  });
});

describe('Y-Combinator', () => {
  // Tests a bit too much currently,
  // but I can't figure out a better way to test it.
  it('should allow for the creation of recursive lambdas', async () => {
    // (Fibonacci 10):
    const Sel = `
      (let res ((Y (λ f (λ n
        ((((If ((≤ n) 1))
         (λ _ n))
         (λ _ ((+ (f ((- n) 1))) (f ((- n) 2)))))
         ∅)))) 10))
      (toJSNumber res)
    `;
    expect((await run(Sel))).to.equal(55);
  });
});


describe('Comments', () => {
  it('should completely remove inline comments', async () => {
    expect((await run('---AAA--- True ---BBB---')).name).to.equal(TruthSymbol);
  });
  it('should completely remove multiline comments', async () => {
    expect((await run(`
      True
      ---
      False
      ---
    `)).name).to.equal(TruthSymbol);
  });
});


describe('Pairs', () => {

  describe('Left', () => {
    it('Should return the left side of the pair', async () => {
      const result = await run(`
        (let myPair ((Pair 0) 1))
        (toJSNumber (Left myPair))
      `);
      expect(result).to.equal(0);
    });
  });

  describe('Right', () => {
    it('Should return the right side of the pair', async () => {
      const result = await run(`
        (let myPair ((Pair 0) 1))
        (toJSNumber (Right myPair))
      `);
      expect(result).to.equal(1);
    });
  });
});


describe('List', () => {

  describe('Head', () => {
    it('Should return head of the list', async () => {
      const result = await run(`
        (let myList ((List 0) ((List 1) ((List 2) ∅))))
        (toJSNumber (Head myList))
      `);
      expect(result).to.equal(0);
      expect(await run(`
        (let myList ((List 0) ((List 1) ((List 2) ∅))))
        (toJSNumber (Head (Tail myList)))
      `)).to.equal(1)
      expect(await run(`
        (let myList ((List 0) ((List 1) ((List 2) ∅))))
        (toJSNumber (Head (Tail (Tail myList))))
      `)).to.equal(2)
    });
  });

  describe('Nth', () => {
    it('Should return the nth member of a list', async () => {
      const nth = n => `
        (toJSNumber ((Nth ((List 0) ((List 1) ((List 2) ∅)))) ${n}))
      `
      expect(await run(nth(0))).to.equal(0)
      expect(await run(nth(1))).to.equal(1)
      expect(await run(nth(2))).to.equal(2)
    });
  });

  describe('Is-Empty', () => {
    it('should only return true for an empty list', async () => {
      expect((await run('(Is-Empty EmptyList)')).name).to.equal(TruthSymbol);
    });
    it('should only return false for a non-empty list', async () => {
      expect((await run('(Is-Empty ((List 1) EmptyList))')).name).to.equal(FalseSymbol);
    });
  });

  describe('Fold', () => {
    it('should fold a list of values to a single one correctly', async () => {
      const result = await run(`
        (let MyList ((List 5)
                    ((List 7)
                    ((List 1) EmptyList))))
        (let ListSum (((Fold MyList) +) 0))
        (toJSNumber ListSum)
      `);
      expect(result).to.equal(13);
    });
  });

  describe('Map', () => {
    it('Should map alements with a function', async () => {
      const result = await run(`
        (let MyList ((List 5)
                    ((List 7)
                    ((List 1) EmptyList))))
        (let MyList2 ((Map MyList) Successor))
        (toJSNumber ((Nth MyList2) 1))
      `);
      expect(result).to.equal(8);
    });
  });

  describe('Length', () => {
    it('Should return the length of a list', async () => {
      const result = await run(`
        (let MyList ((List 5)
                    ((List 7)
                    ((List 1) EmptyList))))
        (toJSNumber (Length MyList))
      `);
      expect(result).to.equal(3);
    });
  });

  describe('Filter', () => {
    it('Should filter a list', async () => {
      const result = await run(`
        (let MyList ((List 5)
                    ((List 7)
                    ((List 1) EmptyList))))
        (let is7 (λ n ((= n) 7)))
        (let FilteredList ((Filter MyList) is7))
        (toJSNumber (Length FilteredList))
      `);
      const result2 = await run(`
        (let MyList ((List 5)
                    ((List 7)
                    ((List 1) EmptyList))))
        (let is7 (λ n ((= n) 7)))
        (let FilteredList ((Filter MyList) is7))
        (toJSNumber (Head FilteredList))
      `);
      expect(result).to.equal(1);
      expect(result2).to.equal(7);
    });
  })
});



describe.only('Integers', () => {
  it('Should construct an integer with a sign and a real number', async () => {
    expect(await run(`(toJSInteger ((Integer Positive) 5))`)).to.equal(5);
    expect(await run(`(toJSInteger ((Integer Negative) 5))`)).to.equal(-5);
    expect(await run(`(toJSInteger ((Integer Negative) 10))`)).to.equal(-10);
  })
  
  it('should correctly identify sign of an integer', async () => {
    expect((await run('(Is-Positive ((Integer Negative) 10))')).name).to.equal(FalseSymbol);
    expect((await run('(Is-Positive ((Integer Positive) 3))')).name).to.equal(TruthSymbol);
  })

  it('should correctly convert an integer to a real number', async () => {
    expect(await run(`(toJSNumber (Integer-To-Real ((Integer Positive) 5)))`)).to.equal(5);
    expect(await run(`(toJSNumber (Integer-To-Real ((Integer Negative) 5)))`)).to.equal(5);
    expect(await run(`(toJSNumber (Integer-To-Real ((Integer Negative) 10)))`)).to.equal(10);
  })

  describe('IntegerSuccessor', async () => {
    it('should increase the absolute value of a positive integer by 1', async () => {
      expect(await run(`(toJSInteger (IntegerSuccessor ((Integer Positive) 2)))`)).to.equal(3);
    })
    it('should increase the absolute value of a 0 by 1', async () => {
      expect(await run(`(toJSInteger (IntegerSuccessor ((Integer Positive) 0)))`)).to.equal(1);
    })
    it('should decrease the absolute value of a negative integer by 1', async () => {
      expect(await run(`(toJSInteger (IntegerSuccessor ((Integer Negative) 5)))`)).to.equal(-4);
    })
  })

  describe('IntegerPredecessor', async () => {
    it('should decrease the absolute value of a positive integer by 1', async () => {
      expect(await run(`(toJSInteger (IntegerPredecessor ((Integer Positive) 2)))`)).to.equal(1);
    })
    it('should increase the decrease value of a 0 by 1', async () => {
      expect(await run(`(toJSInteger (IntegerPredecessor ((Integer Positive) 0)))`)).to.equal(-1);
    })
    it('should increase the absolute value of a negative integer by 1', async () => {
      expect(await run(`(toJSInteger (IntegerPredecessor ((Integer Negative) 5)))`)).to.equal(-6);
    })
  })

  describe('IntegerAddition', async () => {
    
    it('should correctly add two positive integers', async () => {
      expect(await run(`
          (let int1 ((Integer Positive) 2))
          (let int2 ((Integer Positive) 5))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(7);
    })

    it('should correctly add two negative integers', async () => {
      expect(await run(`
          (let int1 ((Integer Negative) 3))
          (let int2 ((Integer Negative) 2))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(-5);
      
      expect(await run(`
          (let int1 ((Integer Negative) 8))
          (let int2 ((Integer Negative) 1))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(-9);
    })

    it('should correctly add negative and positive integers', async () => {
      expect(await run(`
          (let int1 ((Integer Positive) 3))
          (let int2 ((Integer Negative) 7))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(-4);
      expect(await run(`
          (let int1 ((Integer Negative) 2))
          (let int2 ((Integer Positive) 8))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(6);
    })

    it('should handle zeros correctly', async () => {
      expect(await run(`
          (let int1 ((Integer Negative) 0))
          (let int2 ((Integer Positive) 0))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(0);

      expect(await run(`
          (let int1 ((Integer Negative) 0))
          (let int2 ((Integer Positive) 5))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(5);

      expect(await run(`
          (let int1 ((Integer Positive) 0))
          (let int2 ((Integer Negative) 5))
          (toJSInteger ((IntegerAddition int1) int2))
      `)).to.equal(-5);
    })

    
  })

  describe('IntegerSubstraction', async () => {
    
    it('should correctly substract two positive integers', async () => {
      expect(await run(`
          (let int1 ((Integer Positive) 2))
          (let int2 ((Integer Positive) 5))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(-3);
    })

    it('should correctly substract two negative integers', async () => {
      expect(await run(`
          (let int1 ((Integer Negative) 3))
          (let int2 ((Integer Negative) 2))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(-1);
      
      expect(await run(`
          (let int1 ((Integer Negative) 8))
          (let int2 ((Integer Negative) 1))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(-7);
    })

    it('should correctly substract negative and positive integers', async () => {
      expect(await run(`
          (let int1 ((Integer Positive) 3))
          (let int2 ((Integer Negative) 7))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(10);
      expect(await run(`
          (let int1 ((Integer Negative) 2))
          (let int2 ((Integer Positive) 8))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(-10);
    })

    it('should handle zeros correctly', async () => {
      expect(await run(`
          (let int1 ((Integer Negative) 0))
          (let int2 ((Integer Positive) 0))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(0);

      expect(await run(`
          (let int1 ((Integer Negative) 0))
          (let int2 ((Integer Positive) 5))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(-5);

      expect(await run(`
          (let int1 ((Integer Positive) 0))
          (let int2 ((Integer Negative) 5))
          (toJSInteger ((IntegerSubstraction int1) int2))
      `)).to.equal(5);
    })
  })

  describe('IntegerMultipicationSign', () => {

    it('should return Positive for two Positives', async () => {
      const res = await run(`
        (let int1 ((Integer Positive) 1))
        (let int2 ((Integer Positive) 1))
        ((IntegerMultipicationSign int1) int2))
      `)
      expect(res.name).to.equal(TruthSymbol)
    })

    it('should return Positive for two Negatives', async () => {
      const res = await run(`
        (let int1 ((Integer Negative) 1))
        (let int2 ((Integer Negative) 1))
        ((IntegerMultipicationSign int1) int2))
      `)
      expect(res.name).to.equal(TruthSymbol)
    })

    it('should return Negative for two one Positive and Negative mix', async () => {
      const res = await run(`
        (let int1 ((Integer Positive) 1))
        (let int2 ((Integer Negative) 1))
        ((IntegerMultipicationSign int1) int2))
      `)
      expect(res.name).to.equal(FalseSymbol)
    })

    it('should return Negative for two one Negative and Positive mix', async () => {
      const res = await run(`
        (let int1 ((Integer Negative) 1))
        (let int2 ((Integer Positive) 1))
        ((IntegerMultipicationSign int1) int2))
      `)
      expect(res.name).to.equal(FalseSymbol)
    })
  })

})