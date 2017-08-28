
// Built in functions:

const toJSNumber = (number) => {
  let counter = 0;
  number(() => counter++)();
  return counter;
};

const show = (fn) => { //eslint-disable-line
  if (fn.name) {
    console.log(fn.name);
    return;
  }
  console.log(toJSNumber(fn));
};


// End of built in functions.

// Start of compiled program:


/**
The corresponding code in Church Encoding:

(show) ((((λ f.(λ x.(f) ((λ y.((x) (x)) (y))))(λ x.(f) ((λ y.((x) (x)) (y)))))) ((λ f.(λ n.(((((λ c.(λ t.(λ f.((c) (t)) (f))))) ((((λ m.(λ n.((λ n.((n) ((λ _.(λ t.(λ f.f))))) ((λ t.(λ f.t))))) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (m)) (n))))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))) ((λ _.n))) ((λ _.(((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(f) (((n) (f)) (x))))))) (m)))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x))))))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))) ((λ x.(λ t.(λ f.t)))))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x))))))))))))))

**/

const Identity = (x => x);
const Successor = (n => (f => (x => f(n(f)(x)))));
const Predecessor = (n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u)))));
const T_PLUS = (m => (n => n(Successor)(m)));
const T_MINUS = (m => (n => n(Predecessor)(m)));
const T_MULTIPICATION = (m => (n => (f => m(n(f)))));
const Power = (x => (y => y(x)));
const Abs_Difference = (x => (y => T_PLUS(T_MINUS(x)(y))(T_MINUS(y)(x))));
const T_TRUE = (t => (f => t));
const T_FALSE = (t => (f => f));
const T_AND = (p => (q => p(q)(p)));
const T_OR = (p => (q => p(p)(q)));
const T_NOT = (c => c(T_FALSE)(T_TRUE));
const T_IF = (c => (t => (f => c(t)(f))));
const Is_Zero = (n => n((_ => T_FALSE))(T_TRUE));
const T_IS_L_THAN = (m => (n => T_NOT(T_IS_L_THAN_EQ(n)(m))));
const T_IS_L_THAN_EQ = (m => (n => Is_Zero(T_MINUS(m)(n))));
const T_EQUAL = (m => (n => T_AND(T_IS_L_THAN_EQ(m)(n))(T_IS_L_THAN_EQ(n)(m))));
const T_NOT_EQUAL = (m => (n => T_OR(T_NOT(T_IS_L_THAN_EQ(m)(n)))(T_NOT(T_IS_L_THAN_EQ(n)(m)))));
const T_IS_G_THAN = (m => (n => T_NOT(T_IS_L_THAN_EQ(m)(n))));
const T_IS_G_THAN_EQ = (m => (n => T_IS_L_THAN_EQ(n)(m)));
const T_NULL = (x => T_TRUE);
const Is_Null = (l => (h => T_TRUE((d => T_FALSE))));
const $_0 = (f => Identity);
const $_1 = Successor($_0);
const $_2 = Successor($_1);
const $_3 = Successor($_2);
const $_4 = Successor($_3);
const $_5 = Successor($_4);
const $_6 = Successor($_5);
const $_7 = Successor($_6);
const $_8 = Successor($_7);
const $_9 = Successor($_8);
const $_10 = Successor($_9);
const Y = (f => (x => f((y => x(x)(y))))(x => f((y => x(x)(y)))));
const Pair = (x => (y => (f => f(x)(y))));
const Left = (p => p(T_TRUE));
const Right = (p => p(T_FALSE));
const Triple = (x => (y => (z => (f => f(x)(y)(z)))));
const List = (h => (t => Triple(h)(t)(T_FALSE)));
const EmptyList = Triple($_0)($_0)(T_TRUE);
const Head = (l => l((h => (t => (n => h)))));
const Tail = (l => l((h => (t => (n => t)))));
const Is_Empty = (l => l((h => (t => (n => n)))));
const Nth = Y((f => (l => (n => T_IF(Is_Zero(n))((_ => Head(l)))((_ => f(Tail(l))(Predecessor(n))))(T_NULL)))));
const Fold = Y((f => (l => (m => (a => T_IF(Is_Empty(l))((_ => a))((_ => f(Tail(l))(m)(m(a)(Head(l)))))(T_NULL))))));
const MapRight = (l => (f => Fold(l)((nl => (m => List(f(m))(nl))))(EmptyList)));
const Reverse = (l => MapRight(l)(Identity));
const Map = (l => (f => Reverse(MapRight(l)(f))));
const Length = (l => Fold(l)((len => (_ => Successor(len))))($_0));
const Filter = (l => (p => Fold(l)((acc => (m => T_IF(p(m))((_ => List(m)(acc)))((_ => acc))(T_NULL))))(EmptyList)));
const Fibonacci = Y((f => (n => T_IF(T_IS_L_THAN_EQ(n)($_1))((_ => n))((_ => T_PLUS(f(T_MINUS(n)($_1)))(f(T_MINUS(n)($_2)))))(T_NULL))));
show(Fibonacci($_10));
  
