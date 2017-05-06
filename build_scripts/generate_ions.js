/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var jsonfile = require('jsonfile');
var path = require('path');

var args = process.argv.slice(2);

var base_path = path.join(args[0], '/data');

var resources = jsonfile.readFileSync(path.join(base_path, '/resources.json'));
var elements = jsonfile.readFileSync(path.join(base_path, '/elements.json'));
var redox = {};

for (var element in elements) {
  elements[element].includes = elements[element].includes || [];

  var isotopes = elements[element].isotopes;
  for (var isotope in isotopes) {
    elements[element].isotopes[isotope].oxides = [];
    for (var i = 0; i < elements[element].ionization_energy.length; i++) {
      generateOxidation(isotope, i+1, element);
    }
  }
}

steps: make an array with all states concatenated
electron affinity (with opposite sign!!) and ionization energy
process back from the end for oxidation, and the inverse for reduction

function generateOxidation(isotope, charge, element){
  var from = generateName(isotope, charge-1);
  var to = generateName(isotope, charge);

  // 1H is unique!! an hydrogen cation is a lonely proton
  if (to === "1H+") {
    to = "p";
  }

  addResource(from, charge);
  addResource(to, charge-1);

  var ion = {};

  var energy = elements[element].ionization_energy[i];
  ion.reactant = {};
  ion.reactant[from] = 1;
  ion.reactant.eV = energy;

  ion.product = {};
  ion.product[to] = 1;
  ion.product["e-"] = 1;

  // if the energy is negative, then energy is released
  // if(energy < 0){
  //   ion.product.eV = energy;
  // }else{
  //   ion.reactant.eV = energy;
  // }

  var key = generateKey(ion);
  redox[key] = ion;
  if(!elements[element].isotopes[isotope].oxides[key]){
    elements[element].isotopes[isotope].oxides.push(key);
  }
}

function addResource(name, charge){
  if(!resources[name]){
    resources[name] = {};
    resources[name].elements = [element];
    resources[name].html = isotopePrefix(isotope) + element + ionPostfix(charge);
    resources[name].charge = charge;
  }

  if(elements[element].includes.indexOf(name) === -1){
    elements[element].includes.push(name);
  }
}

function generateKey(reaction) {
  var key = "";
  key += concatKeys(reaction.reactant);
  key += concatKeys(reaction.product);

  return key;
}

function concatKeys(map) {
  var key = "";
  for(var i in map){
    if(i === "eV"){
      continue;
    }
    key += i;
  }
  return key;
}

function generateName(isotope, i) {
  if (i === 0) {
    return isotope;
  }
  var postfix = "";
  if(Math.abs(i) > 1){
    postfix = Math.abs(i);
  }
  if(i > 0){
    postfix += "+";
  }else{
    postfix += "-";
  }
  return isotope + postfix;
}

function isotopePrefix(isotope) {
  var prefix = isotope.replace(/(^\d+)(.+$)/i, '$1');
  return "<sup>" + prefix + "</sup>";
}

function ionPostfix(index) {
  var prefix = "";
  if(index === 0){
    return prefix;
  }
  prefix = index.toString();
  return "<sup>" + prefix + "+<sup>";
}

jsonfile.writeFileSync(path.join(base_path, '/resources.json'), resources, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(base_path, '/elements.json'), elements, {
  spaces: 2
});
jsonfile.writeFileSync(path.join(base_path, '/redox.json'), redox, {
  spaces: 2
});
