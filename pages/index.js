const HomePage = ({ posts }) => {
  return (
    <>
      <section className="section py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-md-12 text-center">
              <h1>Blogs</h1>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container">
          <div className="row">
            {posts.map((post) => (
              <div className="col-12 col-sm-12 col-md-4 col-lg-4" key={post.id}>
                <div className="card h-100">
                  <img
                    width="100%"
                    height="auto"
                    src={post.image}
                    alt="Card image cap"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title.rendered}</h5>
                    <div
                      className="card-text"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                    <a href={`/${post.slug}`} className="btn btn-primary">
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps = async () => {
  const res = await fetch("http://wp.socialubiquity.local/wp-json/wp/v2/posts");
  const data = await res.json();

  for (const key in data) {
    const imageMedia = await fetch(
      `http://wp.socialubiquity.local/wp-json/wp/v2/media/${data[key].featured_media}`,
    );
    const imageMediaData = await imageMedia.json();
    data[key].image = imageMediaData.source_url;
  }
  return {
    props: {
      posts: data,
    },
    revalidate: 10,
  };
};

export default HomePage;
