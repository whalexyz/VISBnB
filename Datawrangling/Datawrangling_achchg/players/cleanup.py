# -*- coding: utf-8 -*-
"""
Created on Sun Apr 03 11:08:11 2016

@author: Michaelhua
"""
files=["transition","isolation","ball_handler","roll_man","post_up","spot_up","hand_off","cut","off_screen","putbacks","misc"]
for j in files:
    filename=j

    fin=open(filename+".txt")
    fout=open(filename+".csv","w")
    n=0
    outline=""
    for line in fin:
    	n+=1
    	if n==1:
    		fout.write(line)
    		continue
    	elif n%2==0:
    		outline=line.strip()+"\t"
    	elif n%2==1:
    		outline+=line
    		fout.write(outline)
    		outline=""
    		
    fin.close()
    fout.close()