---
title: Similarities between Rust & JavaScript
date: 2020-12-28
sidebar: 'auto'
categories:
 - rust
tags:
 - rust
 - javascript
publish: true
---

# Why learning Rust ?

I felt that there is a missing tool on my belt. I have use JavaScript quite a lot, Go for some scripts. I also have experiences with other programming languages such as C, Java, PHP but I never used them at work nor on personal projects.

Learning Rust, I think would be a good way of learning a solid programming language that would allow me to do low level things such as networking, hardware... with a programming language which put a critical importance on safety.

Indeed with low level programming language it's easy to have errors related to pointers and more...

Also, there is the shiny WASM project which looks fantastic. By learning Rust I should be able to combine my JavaScript knowledges with Rust by using WASM.

# Learning Rust

Coming from JavaScript. Rust could be tricky to learn. Indeed, the syntax is quite different. Furthermore, Rust has concepts that could be hard to grasp. However the [rust book](https://doc.rust-lang.org/book/) provide a very good way to understand the whole language. I would say it's a very good documentation/guide.

# Goal of this article

With this article I want to give a small glimpse on the similarities that we can find in JavaScript and Rust. 

While it's essentially two different programming languages. I think we can find some common ground which would help JavaScript developers to be more motivated to learn Rust.

# Some common ground

## Function

Like in JavaScript, function are first class citizen. This means that we can declare a function, create a closure and so on... Below are some example

### Simple method

```rust
fn foo() {
    println!("Hello rusty");
}
```

### Closure

```rust
fn main() {
    let res = closure(|x| x + 10, 10);
    // res is equal to 30
}

fn closure(f: fn(x: u32) -> u32, b: u32) -> u32 {
    let a = b * 2;
    
    f(a)
}
```

## Object destructuring

Object destructuring is similar to what we have in the JavaScript world. Consider this example:

```rust
struct Person {
    fname: String,
    lname: String,
    age: u32
}

fn main() {
    let xue = Person {
        fname: "xue".to_string(),
        lname: "zhang".to_string(),
        age: 25
    };
    
    let Person { fname, lname, .. } = xue;
}
```

In JavaScript we would do the following 

```javascript
let person = {
    fname: 'xue',
    lname: 'zhang',
    age: 25
}

let { fname, lname } = person
```

## Operation on array and iterator

In JavaScript when we deal with a collection, we are able to iterate throughout the collection by using utility function such as `map`, `reduce`, `forEach`.

There's also the possibility to do that kind of task by using an iterator to apply it on other type of types of Object such as `Map`, `String` etc...

In JavaScript we would do the following:

```javascript
const array = [2, 3, 4, 5, 6]

const computed = array.map(i => i * 2);
```

In Rust to do the same we use the iterator trait.

```rust
trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
}
```

The trait will allow us to go through a struct / a collection. Below is how a manual iteration would be done.

```rust
fn main() {
    let v = vec![2, 3, 4, 5, 6];
    let mut i = v.iter();
    
    // Output: 2
    println!("{:?}", i.next());
    // Output: 3
    println!("{:?}", i.next());
    // Output: 4
    println!("{:?}", i.next());
    // Output: 5
    println!("{:?}", i.next());
    // Output: 6
    println!("{:?}", i.next());
    // Output: None
    println!("{:?}", i.next());
}
```

However using the iterator trait manually is quite bothersome. Thankfully, Rust provides `adapters` that looks like what we have in the JavaScript world. They'll do the task ```i.next()``` operation automatically until the pointer ```i``` reach the `None` value.

For instance

```rust
fn main() {
    let v = vec![2, 3, 4, 5, 6];

    // this will output: [4, 6, 8, 10, 12]
    let mul: Vec<u32> = v.into_iter().map(|x| x * 2).collect();
}
```

## Async operations

Async operations could be done by using the `async - await` operator in both JavaScript and Rust. Syntax wise it kinda looks the same but under the hood they work differently.

In Rust, async operation is lazy. Meaning that they won't do anything unless they are driven to completion. 

Such actions are done by an `executors`. In JavaScript, the executor would be the `event loop` whivh will digest and return and or wait for a promise to resolve/reject.

For more information on the future check this [good article](https://dev.to/dotxlem/async-rust-but-less-intimidating-2c13)

Examples below are using the `futures create` which provide a set of executors to complete the Future. (Note that Tokio & Async-std are the most popular & used executor)

### Basic async operation

An operation to just calculate a random number and return the computed value + 10

```rust
use futures::executor::block_on;
use rand;

fn main() {
    let future = add();
    println!("happy days");
    let output = block_on(future);

    // will output a random number + 10
    println!("{:?}", output);
}

async fn add() -> u32 {
    // by default variable are immutable
    let mut res = random().await;
    res = res + 10;
    
    res
}

async fn random() -> u32 {
    rand::random::<u32>()
}
```

In JavaScript we are also able to combine multiple async operations and get the result of multiple async operation by using the `Promise.all([...])`. 

In Rust it will depend on the executor that you choose. For instance with the `futures crate` we would use `join!`. (Note that `join!` is a [macro](https://doc.rust-lang.org/1.7.0/book/macros.html))

```rust
use futures::executor::block_on;
use rand;

fn main() {
    let (add, sub) = block_on(async_operations());
    
    println!("add operation {}", add);
    println!("sub operation {}", sub);
}

async fn async_operations() -> (u32, u32) {
    let add_future = add();
    let sub_future = sub();
    
    futures::join!(add_future, sub_future)
}

async fn add() -> u32 {
    // by default variable are immutable
    let mut res = random().await;
    res = res + 10;
    
    res
}

async fn sub() -> u32 {
    let mut res = random().await;
    res = res - 10;
    
    res
}

async fn random() -> u32 {
    rand::random::<u32>()
}
```

To get a deeper idea of how async/await work. Take a look at the [rust book](https://rust-lang.github.io/async-book/01_getting_started/01_chapter.html)


