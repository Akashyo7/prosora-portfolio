import './BlogSection.css';

const BlogSection = () => {
  return (
    <section id="blog" className="h2---section---about">
      <a
        href="https://www.prosora.blog/"
        target="_blank"
        rel="noopener noreferrer"
        className="h2---link-block w-inline-block"
      >
        <h2 className="h2---text">
          blog<span style={{ color: '#f8cb74' }}>.</span>
        </h2>
        <div className="h2---o about">
          <p className="paragraph">Read my latest posts on Prosora Blog</p>
        </div>
      </a>
    </section>
  );
};

export default BlogSection;