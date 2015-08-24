Terminal-SideCar Example
-------------------------

IPython console with rich display output.  Demo will only run on POSIX 
systems.  Requires IPython >= 3.0 and terminado.

Run `python term-sidecar.py` in this directory.

Generate a rich display from the terminal, and it will appear in the rich
display area below the terminal.


```python
from IPython.display import HTML
HTML('<h1>Hello, World!</h1>')
```
