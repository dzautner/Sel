# Sel - Symbolically Expressed Lambdas

A compiler for thin Symbolic Expressions abstraction layer over [Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus).

Was made as a personal project for learning more about compilers and having some fun with developing complex data structures using pure Lambda calculus.

While fairly easy to parse, pure Lambda calculus proved to be fairly difficult to reason about when writing more complex trees.

Sel partially solves the problem by allowing for `let` bindings between functions and meaningful names.

For example, the Identity function in lambda calculus:  

```  
λx . x  
```  

Would be represented in Sel as  
```scheme
(let Identity (λ x x))
```

With the application working the same as in any lisp dialect:  

```scheme  
(Identity EXP)
```

Or in a let free notation:

```scheme
((λ x x) EXP)
```

While the value might not appear immediately clear from small functions, it becomes clearer when complex structures are made. Take as example the following implementation of `(Fibonacci 10)` expression:

```scheme      
(let Fibonacci (Y (λ f (λ n
  ((((If ((≤ n) 1))
   (λ _ n))
   (λ _ ((+ (f ((- n) 1))) (f ((- n) 2)))))
   ∅)))))

(Fibonacci 10)
```

The equivalent `let` free Lambda calculus example would be:  

```scheme  
(((λ f.(λ x.(f) ((λ y.((x) (x)) (y))))(λ x.(f) ((λ y.((x) (x)) (y)))))) ((λ f.(λ n.(((((λ c.(λ t.(λ f.((c) (t)) (f))))) ((((λ m.(λ n.((λ n.((n) ((λ _.(λ t.(λ f.f))))) ((λ t.(λ f.t))))) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (m)) (n))))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))) ((λ _.n))) ((λ _.(((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(f) (((n) (f)) (x))))))) (m)))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x))))))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))) ((λ x.(λ t.(λ f.t)))))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))))))  
```  



## Batteries not included

The language it self has almost no builtins, and all of the primitives are implemented over a (very) thin layer that includes nothing but the ability to define and return lambda expressions.

For example, All of the Boolean logic in Sel is implemented as follows:  


```scheme  
(let True            (λ t (λ f t)))
(let False           (λ t (λ f f)))
(let ∧               (λ p (λ q ((p q) p))))
(let ∨               (λ p (λ q ((p p) q))))
(let ¬               (λ c ((c False) True)))
(let If              (λ c (λ t (λ f ((c t) f)))))  
```  


And even the numerals are implemented as [Church Numerals](https://en.wikipedia.org/wiki/Church_encoding#Church_numerals):

```scheme    
(let Successor       (λ n (λ f (λ x (f ((n f) x))))))
(let Predecessor     (λ n (λ f (λ x (((n (λ g (λ h (h (g f))))) (λ _ x)) (λ u u))))))  
(let 0               (λ f Identity))
(let 1               (Successor 0))
(let 2               (Successor 1))
...
```

Part of the fun in the project was implementing some of the most basic structures without any resources. You can see all of the implementations in the ["base.sel"](https://github.com/dzautner/Sel/blob/master/src/base.sel) file, which is also included by default every time you compile / run Sel code but could be removed with a flag.

Currently the base library includes implementation for:

* Boolean Logic (True, False, ∧, ∨, ¬, If)
* Numerals (Successor, Predecessor, +, - , *, Power, Abs-Difference, 0...10, Is-Zero, <, ≤, =, ≠, >, ≥)
* Recursive Function (Y Combinator)
* Linked Lists (List, EmptyList, Head, Tail, Is-Empty, Nth, Fold, Map, Filter, Reverse, Length)

You can see the implementation for these [here](https://github.com/dzautner/Sel/blob/master/src/base.sel).


## Usage

The compiler is written in JavaScript and uses ES2017 features such as async/await, so to run it you have to have a node version >7 (it was developed against v7.9.0). If you have nvm installed simply run `nvm use` in the project folder.


### CLI tool

`./sel compile [path]` to compile
`./sel run [path]` to compile and evaluate


Both commands will also include `base.sel` during the compilation unless `--remove-base` flag is passed.

By default the compilation target is Javascript with named functions, for example:  
```javascript  
const Fibonacci = Y((f => (n => T_IF(T_IS_L_THAN_EQ(n)($_1))((_ => n))((_ => T_PLUS(f(T_MINUS(n)($_1)))(f(T_MINUS(n)($_2)))))(T_NULL))));  
```  

But Sel also supports compiling to let-free Javascript with the `--compiler=LetFreeJavaScript` flag, which though much less readable looks much more aesthetic and appropriate for a Lambda calculus compilation target:  

```javascript  
 (f => (x => f((y => x(x)(y))))(x => f((y => x(x)(y)))))((f => (n => (c => (t => (f => c(t)(f))))((m => (n => (n => n((_ => (t => (f => f))))((t => (f => t))))((m => (n => n((n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u))))))(m)))(m)(n))))(n)((n => (f => (x => f(n(f)(x)))))((f => (x => x)))))((_ => n))((_ => (m => (n => n((n => (f => (x => f(n(f)(x))))))(m)))(f((m => (n => n((n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u))))))(m)))(n)((n => (f => (x => f(n(f)(x)))))((f => (x => x))))))(f((m => (n => n((n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u))))))(m)))(n)((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((f => (x => x)))))))))((x => (t => (f => t)))))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((f => (x => x)))))))))))))  
```  

All compilation targets will also include a comment block with the pure Lambda term in it:  

```javascript  

/**
The corresponding code in Church Encoding:

(((λ f.(λ x.(f) ((λ y.((x) (x)) (y))))(λ x.(f) ((λ y.((x) (x)) (y)))))) ((λ f.(λ n.(((((λ c.(λ t.(λ f.((c) (t)) (f))))) ((((λ m.(λ n.((λ n.((n) ((λ _.(λ t.(λ f.f))))) ((λ t.(λ f.t))))) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (m)) (n))))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))) ((λ _.n))) ((λ _.(((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(f) (((n) (f)) (x))))))) (m)))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x))))))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))) ((λ x.(λ t.(λ f.t)))))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))))))

**/

```  


## Practical usage for Sel:

None that I could think of.


## Future plans:

As the compiler actually works to what I consider a satisfactory level, I will probably not touch it at all (though PRs are welcomed, of course).

I will most likely continue implementing different algorithms and data-structures for it, as I found the practice pretty fun.


## Resources:

The Wikipedia entry for 'Church encoding' proved to be very useful:
https://en.wikipedia.org/wiki/Church_encoding

The Javascript version of different functions was often more readable when encoded to Javascript:
https://github.com/gtramontina/lambda  
