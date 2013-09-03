MAINDOC = main
OUTPUTNAME = masterarbeit

BUILDDIR = build

TEX = xelatex -jobname=$(OUTPUTNAME) -interaction=nonstopmode -output-directory=$(BUILDDIR)/

all: clean
	mkdir -p $(BUILDDIR)
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null
	biber -q  $(BUILDDIR)/$(OUTPUTNAME)
	#makeglossaries $(MAINDOC)
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null
	$(TEX) $(MAINDOC) | pplatex --input -

.SILENT: all clean open
.PHONY: all clean open

open: all
	open $(BUILDDIR)/$(OUTPUTNAME).pdf

clean:
	rm -rf $(BUILDDIR)
