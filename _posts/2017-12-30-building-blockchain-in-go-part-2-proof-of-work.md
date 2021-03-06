---
layout: post
title: 用 golang 实现区块链系列二 | 工作量证明
tags: blockchain code
---

> 原文地址：[Building Blockchain in Go. Part 2: Proof-of-Work](https://jeiwan.cc/posts/building-blockchain-in-go-part-2/)

## 介绍

在 [上篇文章]({% post_url 2017-12-29-building-blockchain-in-go-part-1-basic-prototype %}) 中, 我们构建了一个很简单的数据结构，这个结构就是区块链数据库的本质。而且我们赋予了它们类似于链式操作中添加数据块的能力：每个区块和前一个区块相链接。不过哦，我们的区块链实现有一个很大的瑕疵：添加一个区块太简单了，成本太低了。区块链和比特币的其中一个重要基石则是添加新的区块非常困难。今天，我们来修复这个瑕疵。

## 工作量证明

区块链的一个关键思想就是在添加数据到区块链之前需要做一些很困难的工作。这个困难的工作是的区块链安全和一致。同时，这个繁重的工作也是有报偿的(这就是人们如何通过挖矿获得币)。

这个机制和现实生活非常像：一是不得不努力工作去获得报酬，以此来维持生活。在区块链中，一些网络的参与者(矿工)工作，并维持网络，添加新的区块到网络中，并从这份工作中获得相应的报酬。他们工作的结果就是以安全的方式将区块纳入到网络中，这是一种维持整个区块链数据库稳定的方式。值得注意的是，完成这项工作的人必须要去证明这一点。

整个 *干活并证明* 的机制被称为 **工作量证明**。这很难，因为它需要大量的计算能力：甚至是高性能的电脑也难以快速算出。除此之外，这个工作困难的点还在于随着时间的增加，新的区块被保持在每小时 6 个的速率。在比特币中，这个工作的目标是为区块找一个有一些限制的 hash 值。这个 hash 就是证据。所以，找到证据是真实的工作。

还有最后一个点。工作量证明的算法必须有一些要求：很难算，但是验证很简单。一份证据通常被其他人拿着，所以，验证不应该花费很长时间。

## 计算哈希(Hashing)

这这一段中，我们将讨论哈希计算。如果你对于这个概念很清楚，当然可以跳过这个部分。

Hashing 是一个针对特定数据计算哈希的过程。一个哈希是数据被计算出的独一无二的代表。哈希函数是获取不定长度的数据并产生固定长度的哈希值的过程。哈希计算有一些关键功能：

1. 源数据不能被通过哈希值恢复。这样，哈希就不是编码了。
2. 确定的数据有且只能有一个哈希值
3. 即使只改变输入数据的一个字节也会产生差异极大的哈希值

![hashing example](https://jeiwan.cc/images/hashing-example.png)

哈希算法被广泛地应用于计算数据一致性。一些软件附带公布出软件的 checksum。在下载之后，你可以把它喂给哈希函数并将产生的哈希值和软件开发者提供的哈希值对比。

在区块链中，哈希被用来保护区块的数据一致性。一个哈希算法的输入值包含着上个区块的 hash 值。这就使得修改链上的区块变得不可能(至少是难度极高)：不仅要重新计算它自己的 hash，还得算出它之后的所有 hash。

## Hashcash

比特币使用 [Hashcash](https://en.wikipedia.org/wiki/Hashcash)，一个最初被发展出来用于屏蔽垃圾邮件的工作量证明的算法。它可以被分解为下面几步：

1. 获取一些公众知道的数据(在邮件的场景下，它是邮箱地址，在比特币场景下，它是区块头)。
2. 给它加个计数器，计数器从 0 开始算。
3. 获取数据和计数器混合的哈希值。
4. 确认这个哈希值满足了一些需求。如果满足了就完成，否则增加计数器并重复步骤 3 和步骤 4.

这是一个很粗暴的算法：改变计数器，算新的哈希，确认，增加计数器，计算哈希，周而复始。这就是为何算力如此高昂的原因。

现在，我们来接触一些满足哈希值得必要条件。原始的 Hashcash 实现的算法，必要条件就像是 “哈希的头 20 个比特必须得是 0”。在比特币中，这个满足条件随着时间的推移不断调整。因为在设计上，区块必须要每 10 分钟生成一个，尽管随着时间不断地增加，算力也增加了，网络上也越来越多的矿工入场也必须如此。

为了演示这个算法，我拿了上个例子中的数据("I like donuts")并找一个开头 3 个 0 比特的哈希值。

![hashcash example](https://jeiwan.cc/images/hashcash-example.png)

**ca07ca** 是计数器的十六进制的值，在十进制中是 13240266

## 实现

好了，学术部分说完了，来开始写代码吧！首先，我们定义一个挖坑困难度：

{% highlight golang %}
const targetBits = 24
{% endhighlight %}

在比特币种，“目标比特”是在每个被挖出来的区块头上存储的困难度。我们暂时并不会实现这个动态调整目标值的算法，所以，我们可以以全局常量的形式定义这个困难度。

24 是一个隔断值，我们的目标是在内存中找到一个少于 256 比特的目标值，而且我们想要使它有足够的不同，还不能太大。因为差别越大，越难找到合适的 hash 值

{% highlight golang %}
type ProofOfWork struct {
    block  *Block
    target *big.Int
}

func NewProofOfWork(b *Block) *ProofOfWork {
    target := big.NewInt(1)
    target.Lsh(target, uint(256-targetBits))

    pow := &ProofOfWork{b, target}

    return pow
}
{% endhighlight %}

这里我们搞了个 **ProofOfWork** 的结构，它有区块指针和一个目标指针。 “target(目标)”是上一段中条件描述的另一个名字。我们使用一个 [big](https://golang.org/pkg/math/big/) 整型，因为这是我们对比哈希和目标值的方式：我们转换哈希成一个 big integer，然后和目标值对比是不是比它小。

在 **NewProofOfWork** 函数中，我们用 1 初始化了一个 **big.int** ，并且获取它 ** 256 - targetBits ** 左边的值。256 是 SHA-256 哈希算法的比特长度，并且这个 SHA-256 哈希算法就是我们要用的，**target** 的十六进制表示是：

{% highlight text %}
0x10000000000000000000000000000000000000000000000000000000000
{% endhighlight %}

它在内存中生成了 29 比特。这里是上个例子中生成的哈希的可视化对比：

{% highlight text %}
0fac49161af82ed938add1d8725835cc123a1a87b1b196488360e58d4bfb51e3
0000010000000000000000000000000000000000000000000000000000000000
0000008b0f41ec78bab747864db66bcb9fb89920ee75f43fdaaeb5544f7f76ca
{% endhighlight %}

第一个哈希("I like donuts" 算出来的)要比目标值大，所以这并不是一个通过校验的工作证明。第二个哈希("I like donutsca07ca"算出来的)要比目标值药效，所以它是一个合理的证明。

你可以想象一下目标值在区间的上边界：如果一个数字(哈希)比边界要小，它就是一个合理的。反之亦然。较低的边界会产生更少的合理的值，所以越困难的工作就需要去找到一个有效的值

现在，我们需要数据区计算 hash，先准备一下：

{% highlight golang %}
func (pow *ProofOfWork) prepareData(nonce int) []byte {
    data := bytes.Join(
        [][]byte{
            pow.block.PrevBlockHash,
            pow.block.Data,
            IntToHex(pow.block.Timestamp),
            IntToHex(int64(targetBits)),
            IntToHex(int64(nonce)),
        },
        []byte{},
    )

    return data
}
{% endhighlight %}

这一块很简单：我们只是合并区块的值带着目标值和 nonce。 这里的 **nonce** 是来自于上面 Hashcash 的描述的计数器，这是一个密码学术语。

好了，所有的准备工作都做完了，我们来实现 PoW 的核心算法吧：

{% highlight golang %}
func (pow *ProofOfWork) Run() (int, []byte) {
    var hashInt big.Int
    var hash [32]byte
    nonce := 0

    fmt.Printf("Mining the block containing \"%s\"\n", pow.block.Data)
    for nonce < maxNonce {
        data := pow.prepareData(nonce)
        hash = sha256.Sum256(data)
        fmt.Printf("\r%x", hash)
        hashInt.SetBytes(hash[:])

        if hashInt.Cmp(pow.target) == -1 {
            break
        } else {
            nonce++
        }
    }
    fmt.Print("\n\n")

    return nonce, hash[:]
}
{% endhighlight %}

首先，我们初始化数据： **hashInt** 是一个代表 **hash** 的值； **nonce** 是计数器。下一步，我们跑了一个“死”循环：它被 **maxNonce** 所限制，它等于 **math.MaxInt64**；这么做是为了避免可能存在的 **nonce** 溢出。虽然我们的 PoW 实现很慢以至于很难让计数器溢出，但仍旧应该做这个检查。

在循环中我们会：

1. 准备数据
2. 用 SHA-256 计算哈希值
3. 转化 hash 成一个 big integer.
4. 和目标值比较

就像我们之前所解释的那样简单。现在我们可以删掉 **Block** 里的 **SetHash** 函数了，然后顺便改造一下 **NewBlock** 函数：

{% highlight golang %}
func NewBlock(data string, prevBlockHash []byte) *Block {
    block := &Block{time.Now().Unix(), []byte(data), prevBlockHash, []byte{}, 0}
    pow := NewProofOfWork(block)
    nonce, hash := pow.Run()

    block.Hash = hash[:]
    block.Nonce = nonce

    return block
}
{% endhighlight %}

这里你可以看到 **nonce** 被存在 **Block**属性中。这是很有必要的，因为需要 **nonce** 去验证证据。现在 **Block** 看起来像是这样：

{% highlight golang %}
type Block struct {
    Timestamp     int64
    Data          []byte
    PrevBlockHash []byte
    Hash          []byte
    Nonce         int
}
{% endhighlight %}

好啦，现在跑一下程序，看一下都运行地对不对：

{% highlight text %}
Mining the block containing "Genesis Block"
00000041662c5fc2883535dc19ba8a33ac993b535da9899e593ff98e1eda56a1

Mining the block containing "Send 1 BTC to Ivan"
00000077a856e697c69833d9effb6bdad54c730a98d674f73c0b30020cc82804

Mining the block containing "Send 2 more BTC to Ivan"
000000b33185e927c9a989cc7d5aaaed739c56dad9fd9361dea558b9bfaf5fbe

Prev. hash:
Data: Genesis Block
Hash: 00000041662c5fc2883535dc19ba8a33ac993b535da9899e593ff98e1eda56a1

Prev. hash: 00000041662c5fc2883535dc19ba8a33ac993b535da9899e593ff98e1eda56a1
Data: Send 1 BTC to Ivan
Hash: 00000077a856e697c69833d9effb6bdad54c730a98d674f73c0b30020cc82804

Prev. hash: 00000077a856e697c69833d9effb6bdad54c730a98d674f73c0b30020cc82804
Data: Send 2 more BTC to Ivan
Hash: 000000b33185e927c9a989cc7d5aaaed739c56dad9fd9361dea558b9bfaf5fbe
{% endhighlight %}

耶！你现在可以看到每个哈希值都以三个 bytes 为 0 开头，而且它也花了一些时间去获取哈希值。

这里还有一件事要去做。我们得让验证工作量变得可行。

{% highlight golang %}
func (pow *ProofOfWork) Validate() bool {
    var hashInt big.Int

    data := pow.prepareData(pow.block.Nonce)
    hash := sha256.Sum256(data)
    hashInt.SetBytes(hash[:])

    isValid := hashInt.Cmp(pow.target) == -1

    return isValid
}
{% endhighlight %}

这就是我们要保存 nonce 的原因。

来再确认一下都没问题了：

{% highlight golang %}
func main() {
    ...

    for _, block := range bc.blocks {
        ...
        pow := NewProofOfWork(block)
        fmt.Printf("PoW: %s\n", strconv.FormatBool(pow.Validate()))
        fmt.Println()
    }
}
{% endhighlight %}

输出：

{% highlight text %}
...

Prev. hash:
Data: Genesis Block
Hash: 00000093253acb814afb942e652a84a8f245069a67b5eaa709df8ac612075038
PoW: true

Prev. hash: 00000093253acb814afb942e652a84a8f245069a67b5eaa709df8ac612075038
Data: Send 1 BTC to Ivan
Hash: 0000003eeb3743ee42020e4a15262fd110a72823d804ce8e49643b5fd9d1062b
PoW: true

Prev. hash: 0000003eeb3743ee42020e4a15262fd110a72823d804ce8e49643b5fd9d1062b
Data: Send 2 more BTC to Ivan
Hash: 000000e42afddf57a3daa11b43b2e0923f23e894f96d1f24bfd9b8d2d494c57a
PoW: true
{% endhighlight %}

## 最后

我们的区块链离真实的架构更近了一步：现在添加区块需要困难的工作了，这就让挖坑成为了可能。但仍旧缺少一些至关重要的功能：区块链数据库并未持久化，也没有钱包，地址，交易，也没有一致化机制。所有的这些我们都要在未来的文章中实现，现在，祝挖矿快乐~

* [基本原型]({% post_url 2017-12-29-building-blockchain-in-go-part-1-basic-prototype %})
* [工作量证明]({% post_url 2017-12-30-building-blockchain-in-go-part-2-proof-of-work %})
* [持久化与命令行]({% post_url 2017-12-30-building-blockchain-in-go-part-3-persistence-and-cli %})
* [交易 1]({% post_url 2018-01-01-build-blockchain-in-go-part-4-transactions-1 %})
* [地址]({% post_url 2018-01-02-building-blockchain-in-go-part-5-addresses %})
* [交易 2]({% post_url 2018-01-06-building-blockchain-in-go-part-6-transactions-2 %})
* [网络]({% post_url 2018-01-12-building-blockchain-go-part-7-network %})

