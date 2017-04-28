# Sel - Symbolically Expressed Lambdas

A compiler for thin Symbolic Expressions abstraction layer over Lambda Calculus.

Was originally made as a personal project for learning more about compilers and having some fun with developing complex data structures using pure Lambda Calculus.

While fairly easy to parse, pure Lambda Calculus proved to be fairly difficult to reason about when writing more complex tress.

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

Or in a point free notation:

```scheme
((λ x x) EXP)
```

While the value might not appear immediately clear from the small functions, it becomes clearer when complex structures are made. Take as example the following implementation of `(Fibonacci 10)` expression:

```scheme      
(let Fibonacci (Y (λ f (λ n
  ((((If ((≤ n) 1))
   (λ _ n))
   (λ _ ((+ (f ((- n) 1))) (f ((- n) 2)))))
   ∅)))))

(Fibonacci 10)
```

The equivalent `let` free Lambda Calculus example would be:  

```scheme  
(((λ f.(λ x.(f) ((λ y.((x) (x)) (y))))(λ x.(f) ((λ y.((x) (x)) (y)))))) ((λ f.(λ n.(((((λ c.(λ t.(λ f.((c) (t)) (f))))) ((((λ m.(λ n.((λ n.((n) ((λ _.(λ t.(λ f.f))))) ((λ t.(λ f.t))))) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (m)) (n))))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))) ((λ _.n))) ((λ _.(((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(f) (((n) (f)) (x))))))) (m)))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x))))))) ((f) ((((λ m.(λ n.((n) ((λ n.(λ f.(λ x.(((n) ((λ g.(λ h.(h) ((g) (f)))))) ((λ _.x))) ((λ u.u))))))) (m)))) (n)) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))) ((λ x.(λ t.(λ f.t)))))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) (((λ n.(λ f.(λ x.(f) (((n) (f)) (x)))))) ((λ f.(λ x.x)))))))))))))  
```  



## Batteries not included

The language it self has almost no builtins, and all of the primitives are implemented over a (very) thin layer that includes nothing but the ability to define and return lambda expressions.

For a classic example, All of the Boolean logic is implemented as follows:  


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

Part of the fun in the project was implementing some of the most basic structures without any resources. You can see all of the implementations in the ["base.sel"](https://github.com/dzautner/Sel/blob/master/src/base.sel) file, which is also included be default every time you compile / run set code (so one doesn't have to define it all for every piece of code) but could be removed with a flag.

Currently the base library include implementation for:

* Boolean Logic (True, False, ∧, ∨, ¬, If)
* Numerals (Successor, Predecessor, +, - , *, Power, Abs-Difference, 0...10, Is-Zero, <, ≤, =, ≠, >, ≥)
* Recursive Function (Y Combinator)
* Linked Lists (List, EmptyList, Head, Tail, Is-Empty, Nth, Fold, Map, Filter, Reverse, Length)

You can see the implementation for these [here](https://github.com/dzautner/Sel/blob/master/src/base.sel).
