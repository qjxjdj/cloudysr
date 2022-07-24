let what: Decimal = 614995508
var num = (what as NSDecimalNumber).uint64Value
var arr = [UInt8]()
while num > 0 {
    let rem = num % (16*16)
    arr.append(UInt8(rem))
    num = num / (16*16)
}
arr.append(UInt8(arr.count))
arr.append(2)
arr = arr.reversed()
arr.forEach {
    print(String($0, radix: 16), terminator: " ")
}