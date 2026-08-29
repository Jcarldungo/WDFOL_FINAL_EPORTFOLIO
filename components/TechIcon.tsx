import {
  siJavascript, siTypescript, siPhp, siPython, siOpenjdk,
  siReact, siNextdotjs, siVuedotjs, siAngular, siInertia, siTailwindcss,
  siNodedotjs, siExpress, siLaravel, siJsonwebtokens,
  siPostgresql, siMysql, siMongodb,
  siGit, siGithub, siVercel, siFigma, siPostman,
} from 'simple-icons';

/** Brand marks from simple-icons, rendered single-colour so the row reads as
 *  one icon set rather than a colour explosion (the site is monochrome). */
const ICONS: Record<string, { path: string }> = {
  javascript: siJavascript, typescript: siTypescript, php: siPhp, python: siPython, java: siOpenjdk,
  react: siReact, next: siNextdotjs, vue: siVuedotjs, angular: siAngular, inertia: siInertia, tailwind: siTailwindcss,
  node: siNodedotjs, express: siExpress, laravel: siLaravel, jwt: siJsonwebtokens,
  postgresql: siPostgresql, mysql: siMysql, mongodb: siMongodb,
  git: siGit, github: siGithub, vercel: siVercel, figma: siFigma, postman: siPostman,
};

export function TechIcon({ name }: { name?: string }) {
  const icon = name ? ICONS[name] : undefined;
  if (!icon) return <span className="tech-icon tech-icon--none" aria-hidden="true" />;
  return (
    <svg className="tech-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
