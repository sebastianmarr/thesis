JOBNAME = masterarbeit
TEX = xelatex -jobname=$(JOBNAME) -output-directory=$(BUILDDIR)/
BUILDDIR = build
CHAPTERDIR = $(BUILDDIR)/chapters
JOBINBUILD = $(BUILDDIR)/$(JOBNAME)
BIBNAME = bibliography
MAIN = main.tex

default : $(MAIN)
	mkdir -p $(CHAPTERDIR)
	$(TEX) $(MAIN)
	cp $(BIBNAME).bib $(BUILDDIR)
	cd $(BUILDDIR); bibtex $(JOBNAME); rm $(BIBNAME).bib
	# makeindex -s $(JOBINBUILD).ist -t $(JOBINBUILD).glg -o $(JOBINBUILD).gls $(JOBINBUILD).glo
	# makeindex -s $(JOBINBUILD).ist -t $(JOBINBUILD).alg -o $(JOBINBUILD).acr $(JOBINBUILD).acn
	$(TEX) $(MAIN)
	$(TEX) $(MAIN)

open : default
	open $(BUILDDIR)/$(JOBNAME).pdf

clean :
	rm -rf $(BUILDDIR)
