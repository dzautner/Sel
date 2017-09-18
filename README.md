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


And it even supports Python! 

```python
(show)((((lambda f: (lambda x: (f)((lambda y: ((x)(x))(y))))(lambda x: (f)((lambda y: ((x)(x))(y))))))((lambda f: (lambda n: (((((lambda c: (lambda t: (lambda f: ((c)(t))(f)))))((((lambda m: (lambda n: ((lambda n: ((n)((lambda _: (lambda t: (lambda f: f)))))((lambda t: (lambda f: t)))))((((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (((n)((lambda g: (lambda h: (h)((g)(f))))))((lambda _: x)))((lambda u: u)))))))(m))))(m))(n)))))(n))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x))))))((lambda _: n)))((lambda _: (((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x)))))))(m))))((f)((((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (((n)((lambda g: (lambda h: (h)((g)(f))))))((lambda _: x)))((lambda u: u)))))))(m))))(n))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x)))))))((f)((((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (((n)((lambda g: (lambda h: (h)((g)(f))))))((lambda _: x)))((lambda u: u)))))))(m))))(n))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x))))))))))((lambda x: (lambda t: (lambda f: t))))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x))))))))))))))
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



# Notes on Lambda Calculus and Sel's implementation:

## Boolean Logic

The most basic formal system we can probably implement using nothing but Lambda expressions is Boolean logic.

Introducing new terms "True" and "False" to our system, we want to be able to negate them (True -> False, False -> True),
And the ability to condition them (Or, And, If).

* And, (Logical symbol ∧). Defined as an operation that takes two Boolean values and returns True if both of the values are True.

```
p     q     output

T     T     T
T     F     F
F     T     F
F     F     F
```


* Or, (Logical symbol ∨). Defined as an operation that takes two Boolean values and returns True if any of the values are True.

```
p     q     output

T     T     T
T     F     T
F     T     T
F     F     F
```

* Negation, (Logical symbol ¬). Defined as an operation that takes a Boolean value and returns the opposite.
  
```
True -> False
False -> True
```

When facing these constraints on the operators, one might be surprised to see how tiny the implementation can be using nothing but lambda expressions.
The difficult part is to decided how to define True and False using Lambda terms to begin with in a way that would allow us to easily implement the above operators.

As it turns out, the answer is that if we define True as a function that returns it's first argument, and False as a function that returns the second argument, the rest is quite trivial to reason about.


## Implementation of Boolean operators 
### And

For the "And" function, that accepts boolean P and Q, we will call the first parameter with it self and the other parameter. In Sel:

```scheme
((p q) p)
```

If "p" is True, in our definition, it will return the first parameter passed to it, in which case: "q".

if "p" is false, it will return the second parameter - itself.

in other words:

if both parameters are True, `((p q) p)` will return True, 

if "p" is False, no matter what the value of "q" is, it will return itself - False.

if "p" is true, but "q" is false, it will return "q" - False.

This definition fits the Truth table we defined for the And operator.

### Or


Unsurprisingly, the "Or" implementation is aesthetically symmetrical to the "And" one. In Sel:
```scheme  
((p p) q)
```  

breaking it down:

if "p" is True, it will return the first parameter "p",
meaning that if "p" is True, the value of "q" doesn't matter and the result will be True.  
```
T T -> T
T F -> T
```

if "p" is False, but "q" is True, it will still return the second parameter - "q", which is True.
```
F T -> T
```

and if both are False, False would also be returned.
```
F F -> F
```
Which satisfies our requirements for *Or*.


### Negation 

Negation might be the clearest example, as simply applying False and True to the input will give you the result:

```scheme
((c False) True)
```

If "c" is False, it will return the second parameter - True, and if it's True it will return the first - False.


