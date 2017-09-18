
class Counter():
  c = 0
  def inc(self, _):
    self.c += 1

'''
Convert Church Numeral to normal python number
'''
def toPythonNumber(number):
  counter = Counter()
  number(counter.inc)(0)
  return counter.c

def show(fn):
  print(toPythonNumber(fn))


# Compiled:


(show)((((lambda f: (lambda x: (f)((lambda y: ((x)(x))(y))))(lambda x: (f)((lambda y: ((x)(x))(y))))))((lambda f: (lambda n: (((((lambda c: (lambda t: (lambda f: ((c)(t))(f)))))((((lambda m: (lambda n: ((lambda n: ((n)((lambda _: (lambda t: (lambda f: f)))))((lambda t: (lambda f: t)))))((((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (((n)((lambda g: (lambda h: (h)((g)(f))))))((lambda _: x)))((lambda u: u)))))))(m))))(m))(n)))))(n))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x))))))((lambda _: n)))((lambda _: (((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x)))))))(m))))((f)((((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (((n)((lambda g: (lambda h: (h)((g)(f))))))((lambda _: x)))((lambda u: u)))))))(m))))(n))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x)))))))((f)((((lambda m: (lambda n: ((n)((lambda n: (lambda f: (lambda x: (((n)((lambda g: (lambda h: (h)((g)(f))))))((lambda _: x)))((lambda u: u)))))))(m))))(n))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x))))))))))((lambda x: (lambda t: (lambda f: t))))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))(((lambda n: (lambda f: (lambda x: (f)(((n)(f))(x))))))((lambda f: (lambda x: x))))))))))))))
