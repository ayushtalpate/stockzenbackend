require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const cors = require("cors");
const User = require("./models/UserModel");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoutes");


const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const {OrdersModel} = require("./models/OrdersModel");



const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;



const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"]; // ✅ Frontend (3001) & Dashboard (3003)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allow cookies and authentication headers
  })
);

app.use(express.json()); // <== Fix for req.body undefined
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
  });



// app.get("/addholdings" , async (req,res) => {
//     let temHoldings=[{
//         name: "BHARTIARTL",
//         qty: 2,
//         avg: 538.05,
//         price: 541.15,
//         net: "+0.58%",
//         day: "+2.99%",
//       },
//       {
//         name: "HDFCBANK",
//         qty: 2,
//         avg: 1383.4,
//         price: 1522.35,
//         net: "+10.04%",
//         day: "+0.11%",
//       },
//       {
//         name: "HINDUNILVR",
//         qty: 1,
//         avg: 2335.85,
//         price: 2417.4,
//         net: "+3.49%",
//         day: "+0.21%",
//       },
//       {
//         name: "INFY",
//         qty: 1,
//         avg: 1350.5,
//         price: 1555.45,
//         net: "+15.18%",
//         day: "-1.60%",
//         isLoss: true,
//       },
//       {
//         name: "ITC",
//         qty: 5,
//         avg: 202.0,
//         price: 207.9,
//         net: "+2.92%",
//         day: "+0.80%",
//       },
//       {
//         name: "KPITTECH",
//         qty: 5,
//         avg: 250.3,
//         price: 266.45,
//         net: "+6.45%",
//         day: "+3.54%",
//       },
//       {
//         name: "M&M",
//         qty: 2,
//         avg: 809.9,
//         price: 779.8,
//         net: "-3.72%",
//         day: "-0.01%",
//         isLoss: true,
//       },
//       {
//         name: "RELIANCE",
//         qty: 1,
//         avg: 2193.7,
//         price: 2112.4,
//         net: "-3.71%",
//         day: "+1.44%",
//       },
//       {
//         name: "SBIN",
//         qty: 4,
//         avg: 324.35,
//         price: 430.2,
//         net: "+32.63%",
//         day: "-0.34%",
//         isLoss: true,
//       },
//       {
//         name: "SGBMAY29",
//         qty: 2,
//         avg: 4727.0,
//         price: 4719.0,
//         net: "-0.17%",
//         day: "+0.15%",
//       },
//       {
//         name: "TATAPOWER",
//         qty: 5,
//         avg: 104.2,
//         price: 124.15,
//         net: "+19.15%",
//         day: "-0.24%",
//         isLoss: true,
//       },
//       {
//         name: "TCS",
//         qty: 1,
//         avg: 3041.7,
//         price: 3194.8,
//         net: "+5.03%",
//         day: "-0.25%",
//         isLoss: true,
//       },
//       {
//         name: "WIPRO",
//         qty: 4,
//         avg: 489.3,
//         price: 577.75,
//         net: "+18.08%",
//         day: "+0.32%",
//       },];

//       temHoldings.forEach((item) => {
//          let newHoldings= new HoldingsModel({
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.avg,
//             net:item.net,
//             day:item.day,
//          })
//          newHoldings.save();
//       })

//       res.send("Done!")
// })

app.get("/addPositions", async (req, res) => {
    const temPostions = [{
        product: "CNC",
        name: "EVEREADY",
        qty: 2,
        avg: 316.27,
        price: 312.35,
        net: "+0.58%",
        day: "-1.24%",
        isLoss: true,
    },
    {
        product: "CNC",
        name: "JUBLFOOD",
        qty: 1,
        avg: 3124.75,
        price: 3082.65,
        net: "+10.04%",
        day: "-1.35%",
        isLoss: true,
    },];

    temPostions.forEach((item) => {
        let newPostions = PositionsModel({
            product: item.product,
            name: item.name,
            qty: item.qty,
            avg: item.avg,
            price: item.price,
            net: item.net,
            day: item.day,
            isLoss: item.isLoss,
        });

        newPostions.save();

    })
    res.send("Done postions Added");
})

app.get("/allHoldings" , async(req,res) => {
    let allHoldings= await  HoldingsModel.find({});
    res.json(allHoldings);
});

app.get("/allPositions" , async(req,res) => {
    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.post("/newOrder",async (req,res) => {
    let newOrder= new OrdersModel({
        name:req.body.name,
        qty:req.body.qty,
        price:req.body.price,
        mode:req.body.mode,
    });

    newOrder.save();
     res.send("orderd saved");
});

app.use("/", authRoute);


app.get("/user", authRoute, async (req, res) => {
    try {
      console.log("🔍 Fetching user details..."); // Debugging log
  
      if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "Unauthorized: No user ID found" });
      }
  
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, user });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out successfully" });
  });
  

app.listen(PORT, () => {
    console.log("Application started..!",PORT);
    mongoose.connect(url);
    console.log("connection etablished sucessfully....!")
})