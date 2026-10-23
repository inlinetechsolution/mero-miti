// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "MeroMiti",
    platforms: [
        .iOS(.v14),
        .macOS(.v11),
        .watchOS(.v7)
    ],
    products: [
        .library(
            name: "MeroMiti",
            targets: ["MeroMiti"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "MeroMiti",
            dependencies: [],
            path: "Sources/MeroMiti"
        ),
        .testTarget(
            name: "MeroMitiTests",
            dependencies: ["MeroMiti"],
            path: "Tests/MeroMitiTests"
        ),
    ]
)
