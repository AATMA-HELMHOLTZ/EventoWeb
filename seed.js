var mongoose = require("mongoose");
var Template = require("./models/template")

var seeds = [
    {
        name: "Clouds Rest",
        image : "https://images.pexels.com/photos/45241/tent-camp-night-star-45241.jpeg?auto=compress&cs=tinysrgb&h=350",
        desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, temporibus ipsa! Porro quibusdam deleniti quaerat aspernatur reiciendis perspiciatis aut cum. Animi velit nobis eos voluptatem sunt reiciendis perspiciatis itaque quia vitae eveniet, aspernatur ipsa eligendi rerum at ipsum ullam quibusdam repudiandae quaerat, quam consequatur exercitationem pariatur non alias architecto. Cum autem architecto veritatis accusantium repudiandae neque porro modi ipsam dolorem beatae? Commodi, rem aperiam provident cum dignissimos cumque consequuntur eos, minima neque qui tenetur ipsum molestiae libero minus, placeat ducimus corrupti veritatis optio? Sit voluptatum qui quas porro excepturi minus, amet aliquam dolores deserunt architecto dolor beatae labore distinctio non quasi inventore iure provident vitae et fugit fugiat. Temporibus animi aliquam eligendi ratione! Delectus officiis minus animi explicabo, hic aliquam nisi quidem ipsum porro ipsa debitis autem labore sapiente at aut facilis impedit maiores possimus maxime nulla! Distinctio sint inventore aliquam reiciendis obcaecati dolorum in asperiores velit. Est possimus voluptatibus saepe temporibus veniam. Laboriosam ratione eos dolore atque adipisci, quibusdam illo nam nulla libero non corporis, cum totam repellendus alias! Perspiciatis provident et sit est numquam distinctio esse voluptas dignissimos quasi quidem tempore rem nesciunt ipsa in aliquid vero, rerum assumenda obcaecati quam impedit a magni neque! Inventore, doloribus tempora?"
    }, 
    {
        name: "Baloon Valley",
        image : "https://images.pexels.com/photos/776117/pexels-photo-776117.jpeg?auto=compress&cs=tinysrgb&h=350",
        desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, temporibus ipsa! Porro quibusdam deleniti quaerat aspernatur reiciendis perspiciatis aut cum. Animi velit nobis eos voluptatem sunt reiciendis perspiciatis itaque quia vitae eveniet, aspernatur ipsa eligendi rerum at ipsum ullam quibusdam repudiandae quaerat, quam consequatur exercitationem pariatur non alias architecto. Cum autem architecto veritatis accusantium repudiandae neque porro modi ipsam dolorem beatae? Commodi, rem aperiam provident cum dignissimos cumque consequuntur eos, minima neque qui tenetur ipsum molestiae libero minus, placeat ducimus corrupti veritatis optio? Sit voluptatum qui quas porro excepturi minus, amet aliquam dolores deserunt architecto dolor beatae labore distinctio non quasi inventore iure provident vitae et fugit fugiat. Temporibus animi aliquam eligendi ratione! Delectus officiis minus animi explicabo, hic aliquam nisi quidem ipsum porro ipsa debitis autem labore sapiente at aut facilis impedit maiores possimus maxime nulla! Distinctio sint inventore aliquam reiciendis obcaecati dolorum in asperiores velit. Est possimus voluptatibus saepe temporibus veniam. Laboriosam ratione eos dolore atque adipisci, quibusdam illo nam nulla libero non corporis, cum totam repellendus alias! Perspiciatis provident et sit est numquam distinctio esse voluptas dignissimos quasi quidem tempore rem nesciunt ipsa in aliquid vero, rerum assumenda obcaecati quam impedit a magni neque! Inventore, doloribus tempora?"
    },
    {
        name: "Canyon Floor",
        image : "https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&h=350",
        desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatem, temporibus ipsa! Porro quibusdam deleniti quaerat aspernatur reiciendis perspiciatis aut cum. Animi velit nobis eos voluptatem sunt reiciendis perspiciatis itaque quia vitae eveniet, aspernatur ipsa eligendi rerum at ipsum ullam quibusdam repudiandae quaerat, quam consequatur exercitationem pariatur non alias architecto. Cum autem architecto veritatis accusantium repudiandae neque porro modi ipsam dolorem beatae? Commodi, rem aperiam provident cum dignissimos cumque consequuntur eos, minima neque qui tenetur ipsum molestiae libero minus, placeat ducimus corrupti veritatis optio? Sit voluptatum qui quas porro excepturi minus, amet aliquam dolores deserunt architecto dolor beatae labore distinctio non quasi inventore iure provident vitae et fugit fugiat. Temporibus animi aliquam eligendi ratione! Delectus officiis minus animi explicabo, hic aliquam nisi quidem ipsum porro ipsa debitis autem labore sapiente at aut facilis impedit maiores possimus maxime nulla! Distinctio sint inventore aliquam reiciendis obcaecati dolorum in asperiores velit. Est possimus voluptatibus saepe temporibus veniam. Laboriosam ratione eos dolore atque adipisci, quibusdam illo nam nulla libero non corporis, cum totam repellendus alias! Perspiciatis provident et sit est numquam distinctio esse voluptas dignissimos quasi quidem tempore rem nesciunt ipsa in aliquid vero, rerum assumenda obcaecati quam impedit a magni neque! Inventore, doloribus tempora?"
    }
]

async function seedDB(){
    await Campground.deleteMany({});
    console.log("Campgrounds removed");
    // await Comment.deleteMany({});
    // console.log("Comments removed");
    // for (const seed of seeds) {
    //     let campground = await Campground.create(seed);
    //     console.log("Campgrounds created");
    //     let comment =  await Comment.create(
    //         {
    //             text: "This place is great, but i wish there was internet",
    //             author: "Boomer"
    //         }
    //     )
    //     console.log("Comment created");
    //     campground.comments.push(comment);
    //     campground.save();
    // }         
}      
module.exports = seedDB;
