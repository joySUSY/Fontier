import { cubicToQuadratic } from 'svg-path-converter';

export const harmonizeCurves = (glyphComponents) => {
  const harmonizedComponents = [];
  for (let i = 0; i < glyphComponents.length; i++) {
    const component = glyphComponents[i];
    if (component.type === 'C') {
      const [x1, y1, x2, y2, x, y] = component.data;
      const [q1, q2, q] = cubicToQuadratic(x1, y1, x2, y2, x, y);
      harmonizedComponents.push({ type: 'Q', data: [q1, q2, q] });
    } else {
      harmonizedComponents.push(component);
    }
  }
  return harmonizedComponents;
};

export const harmonizeSegments = (glyphComponents) => {
  const harmonizedComponents = [];
  for (let i = 0; i < glyphComponents.length; i++) {
    const component = glyphComponents[i];
    if (component.type === 'M' || component.type === 'L') {
      harmonizedComponents.push(component);
    } else if (component.type === 'Q') {
      const [x1, y1, x, y] = component.data;
      harmonizedComponents.push({ type: 'L', data: [x1, y1] });
      harmonizedComponents.push(component);
      harmonizedComponents.push({ type: 'L', data: [x, y] });
    } else if (component.type === 'C') {
      const [x1, y1, x2, y2, x, y] = component.data;
      const [q1, q2, q] = cubicToQuadratic(x1, y1, x2, y2, x, y);
      harmonizedComponents.push({ type: 'L', data: [x1, y1] });
      harmonizedComponents.push({ type: 'Q', data: [q1, q2, q] });
      harmonizedComponents.push({ type: 'L', data: [x, y] });
    }
  }
  return harmonizedComponents;
};

export const roundCorners = (glyphComponents) => {
  const roundedComponents = [];
  for (let i = 0; i < glyphComponents.length; i++) {
    const component = glyphComponents[i];
    if (component.type === 'L') {
      roundedComponents.push(component);
    } else if (component.type === 'Q') {
      const [x1, y1, x, y] = component.data;
      const dx = x - x1;
      const dy = y - y1;
      const d = Math.sqrt(dx * dx + dy * dy);
      const r = d / 2;
      const cx = x1 + dx / 2;
      const cy = y1 + dy / 2;
      const startAngle = Math.atan2(dy, dx) - Math.PI / 2;
      const endAngle = startAngle + Math.PI;
      const largeArcFlag = d > 180 ? 1 : 0;
      const sweepFlag = 1;
      const [x1r, y1r] = [cx + r * Math.cos(startAngle), cy + r * Math.sin(startAngle)];
      const [xr, yr] = [cx + r * Math.cos(endAngle), cy + r * Math.sin(endAngle)];
      roundedComponents.push({ type: 'L', data: [x1r, y1r] });
      roundedComponents.push({
        type: 'A',
        data: [r, r, 0, largeArcFlag, sweepFlag, xr, yr],
      });
    } else if (component.type === 'C') {
      const [x1, y1, x2, y2, x, y] = component.data;
      const [q1, q2, q] = cubicToQuadratic(x1, y1, x2, y2, x, y);
      const [x1r, y1r] = q1;
      const [xr, yr] = q;
      roundedComponents.push({ type: 'L', data: [x1r, y1r] });
      roundedComponents.push({
        type: 'Q',
        data: [x1, y1, xr, yr],
      });
      roundedComponents.push({
        type: 'Q',
        data: [x2, y2, x, y],
      });
    }
  }
  return roundedComponents;
};