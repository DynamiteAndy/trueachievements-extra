interface PostbackButtonProps {
  postback: string;
  icon: string;
  text: string;
  id?: string;
  title?: string;
  wrapText?: boolean;
}

// A site button posting back from its href rather than the site's onclick, so the Postback runs in the page's context
export const PostbackButton = ({ postback, icon, text, id, title, wrapText = false }: PostbackButtonProps) => (
  <a class="button" href={`javascript:Postback('${postback}')`} id={id} title={title}>
    <img src={icon} alt={text} title={text} width="16" height="16" />
    {wrapText ? <span>{text}</span> : text}
  </a>
);
