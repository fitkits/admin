


IGNYET?    CAF    ASTNBIT    # CHECK ASTNFLAG: 
			     # HAS ASTRONAUT RESPONDED
	   MASK	  FLAGWRD7   # TO OUR ENGINE ENABLE 
			     # REQUEST?
	   EXTEND
	   INDEX  WHICH
	   BZF	  12         # BRANCH IF HE HAS NOT
			     #  RESPONDED YET

IGNITION   CS	  FLAGWRD5   # INSURE ENGONFLG IS SET.
	   MASK	  ENGONBIT
	   ADS	  FLAGWRD5
	   CS	  PRIO30     # TURN ON THE ENGINE.
	   EXTEND
	   RAND	  DSALMOUT
	   AD	  BIT13
	   EXTEND
	   WRITE  DSALMOUT
	   EXTEND	     # SET TEVENT FOR DOWNLINK
	   DCA    TIME2
	   DXCH   TEVENT
