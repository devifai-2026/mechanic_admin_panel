interface TitleProps {
  pageTitle: string;
}

const Title: React.FC<TitleProps> = ({ pageTitle }) => {
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {pageTitle}
      </h1>
    </div>
  );
};

export default Title;
