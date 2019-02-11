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

