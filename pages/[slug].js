import Link from "next/link";

const BlogDetails = ({ post }) => {
  return (
    <>
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-sm-12">
              <h1>
                <Link href="/">
                  <a className="btn btn-primary"> Back</a>
                </Link>
                {post.title.rendered}
              </h1>
              <img
                width="100%"
                height="auto"
                src={post.image}
                alt="Card image cap"
              />
              <div className="py-3">
                <h6>
                  Published On:&nbsp;
                  <span className="text-muted">
                    {post.date.split("T")[0].split("-").reverse().join("-")}
                  </span>{" "}
                  &nbsp; &nbsp; Author: &nbsp;
                  <span className="text-muted">{post.authorName}</span>
                </h6>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.rendered,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export const getStaticProps = async (context) => {
  const { params } = context;

  //   console.log(params.slug);
  const res = await fetch(
    `http://wp.socialubiquity.local/wp-json/wp/v2/posts?slug=${params.slug}`,
  );
  const data = await res.json();
  for (const key in data) {
    const imageMedia = await fetch(
      `http://wp.socialubiquity.local/wp-json/wp/v2/media/${data[key].featured_media}`,
    );
    const imageMediaData = await imageMedia.json();
    data[key].image = imageMediaData.source_url;

    const authorDetails = await fetch(
      `http://wp.socialubiquity.local/wp-json/wp/v2/users/${data[key].author}`,
    );
    const authorData = await authorDetails.json();
    data[key].authorName = authorData.name;
  }

  return {
    props: {
      post: data[0],
    },
  };
};

export const getStaticPaths = async () => {
  const res = await fetch("http://wp.socialubiquity.local/wp-json/wp/v2/posts");
  const data = await res.json();
  const slugs = data.map((post) => ({ params: { slug: post.slug } }));

  return {
    paths: slugs,
    fallback: false,
  };
};

export default BlogDetails;
