MAINDOC = main
OUTPUTNAME = masterarbeit

BUILDDIR = build

TEX = xelatex -jobname=$(OUTPUTNAME) -interaction=nonstopmode -output-directory=$(BUILDDIR)/

PP = pplatex --input $(BUILDDIR)/$(OUTPUTNAME).log

all: clean
	mkdir -p $(BUILDDIR)
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null || $(PP) -q
	biber -q  $(BUILDDIR)/$(OUTPUTNAME)
	#makeglossaries $(MAINDOC)
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null || $(PP) -q
	$(TEX) -no-pdf $(MAINDOC) &> /dev/null || $(PP) -q
	$(TEX) $(MAINDOC) &> /dev/null && $(PP)

open: all
	open $(BUILDDIR)/$(OUTPUTNAME).pdf

clean:
	rm -rf $(BUILDDIR)/*

.SILENT: all clean open
.PHONY: all clean open
