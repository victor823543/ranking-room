import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateRoom from "../../../hooks/useCreateRoom";
import {
  convertRankingSystemToLabel,
  RankingSystem,
  Template,
} from "../../../types/Room";
import { callAPI } from "../../../utils/apiService";
import ErrorPage from "../../common/Error/ErrorPage/ErrorPage";
import Spinner from "../../common/Loading/Spinner/Spinner";
import styles from "./CreateFromTemplate.module.css";

const CreateFromTemplate = () => {
  const navigate = useNavigate();
  const { setName, setRankingSystem, setStep, setObjects } = useCreateRoom();
  const { data, isLoading, error } = useQuery({
    queryKey: ["templates"],
    queryFn: () => callAPI<Array<Template>>(`/templates`, "GET"),
  });

  const handleCreateFromTemplate = (
    template: Template,
    system: RankingSystem,
  ) => {
    setName(template.name);
    setRankingSystem(system);
    setObjects(template.objects);
    setStep(3);
    navigate("/create");
  };

  if (error) return <ErrorPage />;
  if (isLoading || data === undefined) return <Spinner />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <DocumentTextIcon />
        </div>
        <h3 className={styles.h3}>Create From Template</h3>
      </div>
      <div className={styles.templates}>
        {data.map((template) => (
          <TemplateDisplay
            key={template._id}
            template={template}
            onSystemClick={handleCreateFromTemplate}
          />
        ))}
      </div>
    </div>
  );
};

type TemplateDisplayProps = {
  template: Template;
  onSystemClick: (template: Template, system: RankingSystem) => void;
};

const TemplateDisplay: React.FC<TemplateDisplayProps> = ({
  template,
  onSystemClick,
}) => {
  const [chooseSystem, setChooseSystem] = useState(false);

  return (
    <motion.div
      layout
      className={`${styles.template} ${chooseSystem ? styles.isChoosing : ""}`}
    >
      <motion.div
        initial={false}
        animate={chooseSystem ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={styles.main}
        onClick={() => setChooseSystem(true)}
      >
        <h4 className={styles.h4}>{template.name}</h4>
        <p className={styles.p}>Total objects: {template.objects.length}</p>
      </motion.div>
      <motion.div
        initial={false}
        animate={chooseSystem ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className={styles.chooseSystem}
        style={
          chooseSystem ? { pointerEvents: "auto" } : { pointerEvents: "none" }
        }
      >
        {template.rankingSystems.map((system) => (
          <div
            key={system}
            className={styles.system}
            onClick={() => onSystemClick(template, system)}
          >
            {convertRankingSystemToLabel[system]}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CreateFromTemplate;
