export function generateClassInputs() {
  const numClasses = document.getElementById('num-classes').value;
  const container = document.getElementById('class-names-container');
  container.innerHTML = '';

  if (numClasses && numClasses > 0) {
    for (let i = 1; i <= numClasses; i++) {
      const label = document.createElement('label');
      label.textContent = `اسم القسم ${i}:`;
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `class-${i}`;
      input.placeholder = `اسم القسم ${i}`;
      container.appendChild(label);
      container.appendChild(input);
    }
  } else {
    alert('يرجى إدخال عدد صحيح للأقسام.');
  }
}