import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ShareService } from '../services/share.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Share } from '../shared/models/share.model';

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { AuthService } from '../services/auth.service'; //for username



@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  share = new Share(); //username password combination
  shares: Share[] = [];
  
  isLoading = true;
  isEditing = false;
  
  // D3 stuff
  private width: number;
  private height: number;
  private margin = {top: 20, right: 20, bottom: 30, left: 40};

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  
  
  addShareForm: FormGroup;
	  shareticker 	= new FormControl('', Validators.required);
	  sharenumbers	= new FormControl('', Validators.required);
	  sharebuyprice = new FormControl('', Validators.required);

  constructor(private shareService: ShareService, 
              private formBuilder: FormBuilder,
              public toast: ToastComponent) { } 


  
  ngOnInit() {
    this.getShares(); //get all shares that the user has
	this.addShareForm = this.formBuilder.group({
      shareticker: this.shareticker,
	  sharenumbers: this.sharenumbers,
      sharebuyprice: this.sharebuyprice
    });
  }
  
  ngAfterViewInit() {
    this.drawChart();
  }

 
  getShares() {
    this.shareService.getShares().subscribe(
      data => this.shares = data,
      error => console.log(error),
      () => {
			var parent = this;
			this.isLoading = false;
			this.drawChart();
			console.log("setting all current values inside of getShares()...");
			this.shares.forEach(function (thisshare) {
				parent.getShareCurrentValue(thisshare); 
			}); 
	  }	
    );
  }
  
  
  addShare() {
    this.shareService.addShare(this.addShareForm.value).subscribe(
      res => {
        this.shares.push(res);
        this.addShareForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }
  
  enableEditing(share: Share) {
    this.isEditing = true;
    this.share = share;
  }
 
  cancelEditing() {
    this.isEditing = false;
    this.share = new Share();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload to reset the editing
    this.getShares();
  }
  
  editShare(share: Share) {
    this.shareService.editShare(share).subscribe(
      () => {
        this.isEditing = false;
        this.share = share;
        this.toast.setMessage('item edited successfully.', 'success');
		this.drawChart();
      },
      error => console.log(error)
    );
  }
  
  deleteShare(share: Share) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.shareService.deleteShare(share).subscribe(
        () => {
          const pos = this.shares.map(elem => elem._id).indexOf(share._id);
          this.shares.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
		  this.drawChart();
        },
        error => console.log(error)
      );
    }
  }
  
  //grabs the current close price for the passed share
  getShareCurrentValue(share) {
	  var shareValue;
	  //var _PRICE;
	  this.shareService.getCurrentValue(share._id).subscribe(   
		data => { shareValue = data; console.log(shareValue);},
		error => console.log(error),
		() => {
			//this.isLoading = false;
			if (shareValue != null) {
				share['closevalue'] = shareValue.currentvalue;
			} 
			else {
				share['closevalue'] = -1; //indicates a share that does not exist
			} 
			//console.log('getShareCurrentValue:: thisshare: ' + thisshare);
			this.drawChart();
		} 
	  );
	  
  }
  
  drawChart() {
	var _X: string[] = [];
	var _Y: number[] = [];
	this.shares.forEach(function (oneshare) {
		_X.push(oneshare.shareticker+" Bought");
		_X.push(oneshare.shareticker+" Current");
		_Y.push(oneshare.sharebuyprice * oneshare.sharenumbers);
		_Y.push(oneshare['closevalue'] * oneshare.sharenumbers);
	});

	  
	//init Svg
	this.svg = d3.select("svg");
	this.svg.selectAll('*').remove(); //removes all previous points, for refreshing
	
    this.width = +960 - this.margin.left - this.margin.right;
    this.height = +500 - this.margin.top - this.margin.bottom;
    this.g = this.svg.append("g")
                     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
					 
					 
	//initAxis				 
	this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(_X.map(function(d) { return d }));
    this.y.domain([0, d3Array.max(_Y, function(d) { return d; })]);
	
	//drawAxis
	this.g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
          .attr("class", "axis axis--y")
          .call(d3Axis.axisLeft(this.y).ticks(10, "s"))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Shares");
	
	
	//drawBars
	var parentG = this.g;
	var parentX = this.x;
	var parentY = this.y;
	var parentHeight = this.height;
	
	this.shares.forEach(function (oneshare) {
		var buyvalue = oneshare.sharebuyprice * oneshare.sharenumbers;
        var closevalue = oneshare.sharenumbers  * oneshare['closevalue'];
		
		//one bar for bought value
        parentG.append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return parentX(oneshare.shareticker + " Bought"); })
          .attr("y", function(d) { return parentY(buyvalue); })
          .attr("width", parentX.bandwidth())
          .attr("height", (d) => parentHeight - parentY(buyvalue) )
		  .attr("fill", "#3399ff");
		 
		//one bar for current value
		if ((closevalue - buyvalue) >= 0) var currentFill = "#00cc66"; 	//green for growth
		else var currentFill = "#cc0000";								//red for decrease
		parentG.append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return parentX(oneshare.shareticker + " Current"); })
          .attr("y", function(d) { return parentY(closevalue); }) 
          .attr("width", parentX.bandwidth())
          .attr("height", (d) => parentHeight - parentY(closevalue))
		  .attr("fill", currentFill);
	});  
	
  }
  

}
