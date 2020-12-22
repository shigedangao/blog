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

## 1. What's a closure

Closure are function / methods that are wrapped within an other function. This allow the enclosed function to access to the parent function scope such as **variables**. 

## 2. Utility

Code writen in JavaScipt are mainly link to an event which has been trigerred by the user or others... Closure are becoming useful when you need to **seperate the business** of an algorithm into private and public method just like in a class in Java. Let's take an example

JavaScript code are mostly triggered by a set of event which has been fired by an external input. i.e:
- a click on a button
- a pubsub event

Closure could be useful for the following scenarios:
- Ensure data privacy
- Create a stateful function

## 3. Example with a scenario

Jake, is on a clothing website. The website offer the option to customize a product. Customizing a product allow you to do the following operations:
- Add a label
- Change the color
- Change a size.   

### Divide the customization feature into several little features

1. A user add a custom label to a cloth 
2. It can customize it's color
3. It can customize it's size

#### Without closure

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

#### A first try with a closure

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

// Pull output: {label: "foo", color: "black", size: "M"}
```

#### Result of our first implementation

As you can see with a simple closure we are able to do the customization process much more easily. We don't have to pass the product object to every function.
By passing the product object to the first method we allow the first method to do some operations with this product object without altering existing objects.

Such operations are the same as the first example without the closures. However as you can notice there are some changes to the signature of the `set` properties of these methods. These `customization` methods does not take any arguments which is not great.

One observation that we can find is that we passed every customization to the second methods. Ideally this is not the best option as it would be better to pass the `default configuration` to that closure instead of passing the `customization` object. 

Let's see how we can improve this closure to make it more friendly

#### Second implementation


```javascript

const customizeProduct = product => payload => {
  // set based properties 
  const copy = {...product, ...payload}

  return {
    setLabel(label) {
      copy.label = label

      return this
    },
    setColor(color) {
      copy.color = color

      return this
    },
    setSize(size) {
      copy.size = size

      return this
    },
    finally() {
      return copy
    }
  }
}

const customize = customizeProduct({
  name: 'best shirt',
  brand: 'nike',
  type: 'shirt',
})

const blackNikeShirt = customize({ price: 100, clothStyle: 'sport', limited: true })
  .setLabel('yo')
  .setColor('black')
  .setSize('L')
  .finally()
// Output: {name: "best shirt", brand: "nike", type: "shirt", price: 100, clothStyle: "sport"...}

const whiteNikeShirt = customize({ price: 50, clothStyle: 'sport', limited: false })
  .setLabel('yo')
  .setColor('white')
  .setSize('L')
  .finally()
// Output: {name: "best shirt", brand: "nike", type: "shirt", price: 50, clothStyle: "sport"...}
```

This time we're making full use of the closure capabilities. What we did compare to the first example are:
- Create a copy of our base object
- Allow parameter to `customization` methods
- Add a finally method to return the customized object

We also change how we call the `customizeProduct` method. In the first implementation of the closure we passed the customization object straight away to the second method. However it could be useful to store the result of the closure for reusability purposes. 

For instance, in the second implementation we want to customize 2 shirt which has the same:
- name
- brand
- type

With the closure we are able to store the result of the closure which contains the basic information of this product. And then we can then customize these 2 product independantly from each other. Reusability is what makes closure pretty powerful

### 3. Conclusion

Closure are useful tools that allow developer to reuse part of an object somewhere else with the context generated from the first computation. This method could be useful in the belt of tool of a developer to make it's code clearer & simpler. 