MAINDOC = main
TEX = xelatex -interaction=nonstopmode

all:
	make xetex
xetex:	
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null
	biber -q  $(MAINDOC)
	# makeglossaries $(MAINDOC)
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null
	$(TEX) $(MAINDOC)

	make clean &> /dev/null
open:
	make xetex
	open $(MAINDOC).pdf
clean:
	rm -f $(MAINDOC).aux
	rm -f $(MAINDOC).acn
	rm -f $(MAINDOC).acr
	rm -f $(MAINDOC).bbl
	rm -f $(MAINDOC).blg
	rm -f $(MAINDOC).alg
	rm -f $(MAINDOC).glg
	rm -f $(MAINDOC).glo
	rm -f $(MAINDOC).gls
	rm -f $(MAINDOC).dvi
	rm -f $(MAINDOC).ist
	rm -f $(MAINDOC).lof
	rm -f $(MAINDOC).log
	rm -f $(MAINDOC).lol
	rm -f $(MAINDOC).out
	rm -f $(MAINDOC).pdfsync
	rm -f $(MAINDOC).ps
	rm -f $(MAINDOC).toc
	rm -f $(MAINDOC).xdv