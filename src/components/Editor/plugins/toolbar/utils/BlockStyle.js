// The function will return block inline styles using block level meta-data
export default function blockStyleFn(block) {
  const classes = [];

  const blockAlignment = block.getData() && block.getData().get('text-align');

  if (blockAlignment) {
    classes.push(`itd-${blockAlignment}-aligned-block`);
  }

  if (block.getType() === 'blockquote') {
    classes.push(`itd-blockquote`);
  }

  return classes.join(' ');
}
