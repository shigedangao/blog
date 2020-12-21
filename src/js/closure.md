---
title: JavaScript's Closure
date: 2020-12-21
sidebar: 'auto'
categories:
  - javascript
tags:
  - javascript
  - learning
publish: true
---
# Explains JavaScript

### 1. What's a closure

Closure are function / methods that are wrapped within an other function. This allow the enclosed function to access to the parent function scope such as **variables**. 

### 2. Utility

Code writen in JavaScipt are mainly link to an event which has been trigerred by the user or others... Closure are becoming useful when you need to **seperate the business** of an algorithm into private and public method just like in a class in Java. Let's take an example

JavaScript code are mostly triggered by a set of event which has been fired by an external input. i.e:
- a click on a button
- a pubsub event

Closure could be useful for the following scenarios:
- Ensure data privacy
- Create a stateful function

### 3. Example with a scenario

Jake, is on a clothing website. The website offer the option to customize a product. Customizing a product allow you to do the following operations:
- Add a label
- Change the color
- Change a size.   

#### Divide the customization feature into several little features

1. A user add a custom label to a cloth 
2. It can customize it's color
3. It can customize it's size

##### Without closure

```javascript
// Let's say that there's a cloth reference below in the website
const base = {}

function bootstrap() {
  return {...base}
}

/**
 * Set Label
 */
function setProductLabel(product, label){
  product.label = label;	
}

/**
 * Set Product Size
 */
function setProductSize(product, size){
  product.size = size;
}

/**
 * Set Product Color
 */
function setProductColor(product, color){
  product.color = color;
}

// Create a new product
let pull = bootstrap();
  
// Customize the product
setProductLabel(pull, "It's a beautiful day !")
setProductSize(pull, 21);
setProductColor(pull, "blue");

// Output will be
// {label: "It's a beautiful day !", size: 21, color: "blue"}
```

As you can see our example have an issue. The main issue that we can see straight away is the need to pass the `product` object to every `set` functions. This is very annoying and we could simplify this by using a closure.

##### With a closure

```javascript
const base = {}

function bootstrap() {
  return {...base}
}

const customizeProduct = product => payload => {
  return {
    setLabel() {
      product.label = payload.label

      return this
    },
    setColor() {
      product.color = payload.color

      return this
    },
    setSize() {
      product.size = payload.size

      return this
    }
  }
}

const pull = bootstrap()
customizeProduct(pull)({ label: 'foo', color: 'black', size: 'M' })
  .setLabel()
  .setColor()
  .setSize()

// Output: {label: "foo", color: "black", size: "M"}
```

#### Result of our closure

As you can see we have wrap all customization within one single method. This method take as a first argument the `product`. 
This first method will then return an other function which this time accept a `customization` object.

Once we call the second method with the `customization` the method will return a set of method which allow us to do some customization (a bit like the builder pattern).

This allow us to then simply call the customization method that we need.

An interesting observation could be made. 

### 3. Conclusion

Closure are functions which help us, developer to seperate the business / algorithm into a module pattern which help us to make clear, easy and reusable code. 
