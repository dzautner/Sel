
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

show((f => (x => f((y => x(x)(y))))(x => f((y => x(x)(y)))))((f => (n => (c => (t => (f => c(t)(f))))((m => (n => (n => n((_ => (t => (f => f))))((t => (f => t))))((m => (n => n((n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u))))))(m)))(m)(n))))(n)((n => (f => (x => f(n(f)(x)))))((f => (x => x)))))((_ => n))((_ => (m => (n => n((n => (f => (x => f(n(f)(x))))))(m)))(f((m => (n => n((n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u))))))(m)))(n)((n => (f => (x => f(n(f)(x)))))((f => (x => x))))))(f((m => (n => n((n => (f => (x => n((g => (h => h(g(f)))))((_ => x))((u => u))))))(m)))(n)((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((f => (x => x)))))))))((x => (t => (f => t)))))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((n => (f => (x => f(n(f)(x)))))((f => (x => x))))))))))))))
