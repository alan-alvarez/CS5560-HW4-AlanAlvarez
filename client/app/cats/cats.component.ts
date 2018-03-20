import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CatService } from '../services/cat.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Cat } from '../shared/models/cat.model';


//New stuff for the vault
import { AuthService } from '../services/auth.service';
import { Domain } from '../shared/models/domain.model';


@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.css']
})
export class CatsComponent implements OnInit {

  comb = new Cat(); //username password combination
  combs: Cat[] = [];
  domain = new Domain();
  domains: Domain[] = [];
  
  isLoading = true;
  isEditing = false;

  /*
  //new variables for the vault
  chosencat = new Cat();
  deletecat = new Cat();

  addCatForm: FormGroup;
    name = new FormControl('', Validators.required);
    age = new FormControl('', Validators.required);
    weight = new FormControl('', Validators.required);
  */
  
  //the forms on the component.html page 
  selectDomainForm: FormGroup;
	selectdomain = new FormControl('', Validators.required);
  
  addDomainForm: FormGroup;
	domainname = new FormControl('', Validators.required);
	
  deleteDomainForm: FormGroup;
	deletedomain = new FormControl('', Validators.required);
  

  
  addCombinationForm: FormGroup;
	  catusername = new FormControl('', Validators.required);
	  catpassword = new FormControl('', Validators.required);
	  
	  //throws weird error... maybe missing in component.html ?
  /* deleteCombinationForm: FormGroup;
      catusername = new FormControl('', Validators.required);
	  catpassword = new FormControl('', Validators.required);
    }); */
  

   constructor(private catService: CatService, 
              private formBuilder: FormBuilder,
              public toast: ToastComponent) { }







  /* ngOnInit() {
    this.getCats();
    this.addCatForm = this.formBuilder.group({
      name: this.name,
      age: this.age,
      weight: this.weight
    });
/*     this.addDomainForm = this.formBuilder.group({
      domain: this.domain 
    }); */  
/*
  } */
  
  ngOnInit() {
    this.getCats(); //get all username password combinations 
	this.getDomains(); //get all domains for the given user
	
	//all the forms: select domain, add domain, delete domain, add combination, delete combination 
	this.selectDomainForm = this.formBuilder.group({
		selectdomain: this.selectdomain
    });
	this.addDomainForm = this.formBuilder.group({
		domainname: this.domainname
    });
	this.deleteDomainForm = this.formBuilder.group({
		deletedomain: this.deletedomain
    });
    this.addCombinationForm = this.formBuilder.group({
      catusername: this.catusername,
      catpassword: this.catpassword
    });
	this.deleteCombinationForm = this.formBuilder.group({
      catusername: this.catusername,
      catpassword: this.catpassword
    });
	
	
  }

 
  getCats() {
    this.catService.getCombs().subscribe(
      data => this.combs = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  
  addCat() {
	//tie the domain to the combination via drop down selection 
	this.addCombinationForm.value.catdomain = this.domains[this.selectdomain.value].domainname;

	this.catService.addComb(this.addCombinationForm.value).subscribe(
      res => {
        this.combs.push(res);
        this.addCombinationForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }
	
  deleteCat(cat: Cat) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.catService.deleteComb(cat).subscribe(
        () => {
          const pos = this.cats.map(elem => elem._id).indexOf(cat._id);
          this.cats.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      ); 
    } 
  }
	
  
  getDomains() {
    this.catService.getDomains().subscribe(
      data => this.domains = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  
  addDomain() {
    this.catService.addDomain(this.addDomainForm.value).subscribe(
      res => {
        this.domains.push(res);
        this.addDomainForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }
  
  deleteDomain(domain: Domain) {
    if (window.confirm('Are you sure you want to permanently delete this domain?')) {
      this.catService.deleteDomain(domain).subscribe(
        () => {
		 //delete just like in deleteCat()
          const pos = this.domains.map(elem => elem._id).indexOf(domain._id);
          this.domains.splice(pos, 1);
          this.toast.setMessage('domain deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  //what is this for??????
  enableEditing(cat: Cat) {
    this.isEditing = true;
    this.cat = cat;
  }

  //??
  cancelEditing() {
    this.isEditing = false;
    this.cat = new Cat();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the cats to reset the editing
    this.getCats();
  }

  
  //going to be ingoring all editing capibilities...!!!!!!!
  
  /* editCat(cat: Cat) {
    this.catService.editCat(cat).subscribe(
      () => {
        this.isEditing = false;
        this.cat = cat;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  } */

  
  

}
