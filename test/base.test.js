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

});
