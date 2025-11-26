import shared from "../../shared/styles.module.scss";
import item from "../../../../assets/PTCQuizItem.png";

export const Upload = () => {
  return (
    <div className={shared.section}>
      <div className={shared.sectionContent}>
        <h2 className={shared.title}>Stop Wasting Time.</h2>
        <p className={shared.subtitle}>
          Just upload your notes and let us take care of the rest.
        </p>
        <img src={item} className={shared.sectionImg} alt="Example Quiz" />
      </div>
    </div>
  );
};
