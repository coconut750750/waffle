function Restaurant(id, name, price, rating, image_url) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.rating = rating;
    this.image_url = image_url;
    this.rank = 1000;
}

export default Restaurant